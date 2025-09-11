import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { connectDB } from '@/lib/db/connection';
import { uploadToCloudinary, DOCUMENT_CONFIGS } from '@/lib/cloudinary';
import FileUpload from '@/lib/db/models/FileUpload';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const applicationId = formData.get('applicationId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!documentType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
    }

    // Get document configuration
    const config = DOCUMENT_CONFIGS[documentType as keyof typeof DOCUMENT_CONFIGS];
    if (!config) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    // Validate file size
    if (file.size > config.max_file_size) {
      return NextResponse.json({ 
        error: `File size exceeds limit of ${config.max_file_size / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    // Validate file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !config.allowed_formats.includes(fileExtension)) {
      return NextResponse.json({ 
        error: `Invalid file format. Allowed formats: ${config.allowed_formats.join(', ')}` 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: config.folder,
      allowed_formats: config.allowed_formats,
      max_file_size: config.max_file_size,
      transformation: (config as any).transformation || [],
    });

    // Save file record to database
    const fileRecord = new FileUpload({
      originalName: file.name,
      fileName: uploadResult.public_id,
      fileUrl: uploadResult.secure_url,
      fileType: uploadResult.format,
      fileSize: uploadResult.bytes,
      uploadedBy: session.user.id,
      documentType,
      applicationId: applicationId || undefined,
      cloudinaryPublicId: uploadResult.public_id,
    });

    await fileRecord.save();

    return NextResponse.json({
      success: true,
      file: {
        _id: fileRecord._id,
        originalName: fileRecord.originalName,
        fileName: fileRecord.fileName,
        fileUrl: fileRecord.fileUrl,
        fileType: fileRecord.fileType,
        fileSize: fileRecord.fileSize,
        uploadedBy: fileRecord.uploadedBy,
        uploadedAt: fileRecord.uploadedAt,
        documentType: fileRecord.documentType,
        applicationId: fileRecord.applicationId,
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const documentType = searchParams.get('documentType');
    const userId = searchParams.get('userId');

    // Build query
    const query: any = {};
    
    if (applicationId) {
      query.applicationId = applicationId;
    }
    
    if (documentType) {
      query.documentType = documentType;
    }
    
    if (userId) {
      query.uploadedBy = userId;
    } else if (session.user.role === 'user') {
      // Users can only see their own files
      query.uploadedBy = session.user.id;
    }

    const files = await FileUpload.find(query)
      .sort({ uploadedAt: -1 })
      .populate('uploadedBy', 'firstName lastName email')
      .lean();

    return NextResponse.json({
      success: true,
      files
    });

  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
