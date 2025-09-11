import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { connectDB } from '@/lib/db/connection';
import LoanApplication from '@/lib/db/models/LoanApplication';
import FileUpload from '@/lib/db/models/FileUpload';
import { logInfo, logError, logApiResponse } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const method = 'GET';
  let session: Session | null = null;

  try {
    const { id } = await params;
    const url = `/api/applications/${id}`;

    // Check authentication
    session = await getServerSession(authOptions);
    if (!session?.user) {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 401, duration);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find the application
    const application = await LoanApplication.findById(id)
      .populate('userId', 'firstName lastName email phone')
      .populate('assignedDSAs', 'firstName lastName email bank dsaId')
      .lean();

    if (!application) {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 404, duration, session.user.id);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check authorization - users can only see their own applications, DSAs can see assigned applications, admins can see all
    const canAccess = 
      session.user.role === 'admin' ||
      (session.user.role === 'user' && application.userId._id.toString() === session.user.id) ||
      (session.user.role === 'dsa' && application.assignedDSAs.some((dsa: any) => dsa._id.toString() === session.user.id));

    if (!canAccess) {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 403, duration, session.user.id);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch associated documents/files
    const documents = await FileUpload.find({
      applicationId: id,
      isDeleted: false
    }).lean();

    // Structure the response
    const applicationDetails = {
      ...application,
      documents: documents.map(doc => ({
        _id: doc._id,
        originalName: doc.originalName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        documentType: doc.documentType,
        uploadedAt: doc.uploadedAt,
        isImage: doc.mimeType?.startsWith('image/'),
        isPDF: doc.mimeType === 'application/pdf'
      }))
    };

    const duration = Date.now() - startTime;
    logInfo('Application details fetched successfully', { 
      applicationId: id, 
      userId: session.user.id,
      documentsCount: documents.length 
    });
    logApiResponse(method, url, 200, duration, session.user.id);

    return NextResponse.json({
      success: true,
      application: applicationDetails
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const userId = session?.user?.id;
    logError('Application details fetch failed', error, { userId });
    logApiResponse(method, `/api/applications/[id]`, 500, duration, userId);
    
    return NextResponse.json(
      { error: 'Failed to fetch application details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  const method = 'PUT';
  let session: Session | null = null;

  try {
    const { id } = await params;
    const url = `/api/applications/${id}`;

    // Check authentication
    session = await getServerSession(authOptions);
    if (!session?.user) {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 401, duration);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and DSAs can update applications
    if (session.user.role === 'user') {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 403, duration, session.user.id);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData = await request.json();
    await connectDB();

    // Find and update the application
    const updatedApplication = await LoanApplication.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email phone')
      .populate('assignedDSAs', 'firstName lastName email bank dsaId')
      .lean();

    if (!updatedApplication) {
      const duration = Date.now() - startTime;
      logApiResponse(method, url, 404, duration, session.user.id);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const duration = Date.now() - startTime;
    logInfo('Application updated successfully', { 
      applicationId: id, 
      userId: session.user.id,
      updatedFields: Object.keys(updateData)
    });
    logApiResponse(method, url, 200, duration, session.user.id);

    return NextResponse.json({
      success: true,
      application: updatedApplication
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const userId = session?.user?.id;
    logError('Application update failed', error, { userId });
    logApiResponse(method, `/api/applications/[id]`, 500, duration, userId);
    
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
