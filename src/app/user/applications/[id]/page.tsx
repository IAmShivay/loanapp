import { getAuthSession } from '@/lib/auth/utils';
import { redirect, notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface ApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'user') {
    redirect('/login');
  }

  // TODO: Replace with actual API call
  const application = {
    id: params.id,
    applicationId: 'LA202412001',
    status: 'under_review',
    priority: 'high',
    submittedAt: '2024-12-10T10:30:00Z',
    lastUpdated: '2024-12-11T14:20:00Z',
    
    // Personal Information
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      dateOfBirth: '1995-05-15',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F'
    },
    
    // Address Information
    addressInfo: {
      address: '123 Main Street, Sector 15',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    
    // Education Information
    educationInfo: {
      institution: 'Stanford University',
      course: 'MS Computer Science',
      duration: '2 years',
      admissionDate: '2024-09-01',
      feeStructure: 5000000
    },
    
    // Loan Information
    loanInfo: {
      amount: 500000,
      purpose: 'Masters in Computer Science at Stanford University. The program covers advanced topics in AI, Machine Learning, and Software Engineering.'
    },
    
    // Financial Information
    financialInfo: {
      annualIncome: 1200000,
      employmentType: 'Salaried',
      employerName: 'Tech Corp India'
    },
    
    // DSA Information
    dsaInfo: {
      name: 'Jane Smith',
      bank: 'SBI',
      dsaId: 'SBI238001EMB',
      contact: '+91 9876543210',
      email: 'jane.smith@sbi.co.in'
    },
    
    // Documents
    documents: {
      required: [
        { name: 'Aadhar Card', key: 'aadhar', status: 'submitted', uploadedAt: '2024-12-10' },
        { name: 'PAN Card', key: 'pan', status: 'submitted', uploadedAt: '2024-12-10' },
        { name: 'Income Proof', key: 'income', status: 'submitted', uploadedAt: '2024-12-10' },
        { name: 'Admission Letter', key: 'admission', status: 'submitted', uploadedAt: '2024-12-10' },
        { name: 'Bank Statements', key: 'bank_statements', status: 'pending', uploadedAt: null },
        { name: 'Collateral Documents', key: 'collateral', status: 'pending', uploadedAt: null }
      ]
    },
    
    // Timeline
    timeline: [
      {
        date: '2024-12-10T10:30:00Z',
        status: 'submitted',
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted and is now in the queue for review.',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      {
        date: '2024-12-10T11:15:00Z',
        status: 'assigned',
        title: 'DSA Assigned',
        description: 'Your application has been assigned to Jane Smith from SBI Bank.',
        icon: User,
        iconColor: 'text-blue-600'
      },
      {
        date: '2024-12-11T14:20:00Z',
        status: 'document_request',
        title: 'Additional Documents Required',
        description: 'Please upload bank statements and collateral documents to proceed with the review.',
        icon: AlertCircle,
        iconColor: 'text-orange-600'
      }
    ]
  };

  if (!application) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const submittedDocs = application.documents.required.filter(doc => doc.status === 'submitted').length;
  const totalDocs = application.documents.required.length;
  const documentProgress = (submittedDocs / totalDocs) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/user/applications">
            <Button variant="ghost" >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{application.applicationId}</h1>
              <Badge className={getStatusColor(application.status)}>
                {application.status.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityColor(application.priority)} >
                {application.priority} priority
              </Badge>
            </div>
            <p className="text-slate-600">
              Submitted on {new Date(application.submittedAt).toLocaleDateString()} • 
              Last updated {new Date(application.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Document Progress */}
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Document Status
            </CardTitle>
            <CardDescription>
              {submittedDocs} of {totalDocs} required documents submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(documentProgress)}% Complete</span>
                </div>
                <Progress value={documentProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {application.documents.required.map((doc) => (
                  <div key={doc.key} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="font-medium text-slate-900">{doc.name}</div>
                        {doc.uploadedAt && (
                          <div className="text-xs text-slate-500">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDocumentStatusColor(doc.status)} >
                        {doc.status}
                      </Badge>
                      {doc.status === 'pending' && (
                        <Button  variant="outline">
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Application Details */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <p className="text-slate-900">{application.personalInfo.firstName} {application.personalInfo.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                    <p className="text-slate-900">{new Date(application.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {application.personalInfo.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="text-slate-900 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {application.personalInfo.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Aadhar Number</label>
                    <p className="text-slate-900">{application.personalInfo.aadharNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">PAN Number</label>
                    <p className="text-slate-900">{application.personalInfo.panNumber}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Address</label>
                  <p className="text-slate-900 flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    <span>
                      {application.addressInfo.address}<br />
                      {application.addressInfo.city}, {application.addressInfo.state} - {application.addressInfo.pincode}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Education Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Institution</label>
                    <p className="text-slate-900 font-medium">{application.educationInfo.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Course</label>
                    <p className="text-slate-900">{application.educationInfo.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Duration</label>
                    <p className="text-slate-900">{application.educationInfo.duration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Admission Date</label>
                    <p className="text-slate-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(application.educationInfo.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Total Fee</label>
                    <p className="text-slate-900 font-semibold">₹{application.educationInfo.feeStructure.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Loan Amount</label>
                  <p className="text-2xl font-bold text-blue-600">₹{application.loanInfo.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Purpose</label>
                  <p className="text-slate-900">{application.loanInfo.purpose}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Annual Income</label>
                  <p className="text-slate-900">₹{application.financialInfo.annualIncome.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Employment</label>
                  <p className="text-slate-900">{application.financialInfo.employmentType} at {application.financialInfo.employerName}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline and DSA Info */}
          <div className="space-y-6">
            {/* DSA Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Assigned DSA
                </CardTitle>
                <CardDescription>Your dedicated loan advisor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{application.dsaInfo.name}</div>
                    <div className="text-sm text-slate-500">{application.dsaInfo.bank} Bank • {application.dsaInfo.dsaId}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{application.dsaInfo.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{application.dsaInfo.email}</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contact DSA
                </Button>
              </CardContent>
            </Card>

            {/* Application Timeline */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Application Timeline
                </CardTitle>
                <CardDescription>Track your application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.timeline.map((event, index) => {
                    const IconComponent = event.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className={`p-2 rounded-full ${event.iconColor} bg-opacity-10`}>
                          <IconComponent className={`h-4 w-4 ${event.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-slate-900">{event.title}</h4>
                            <span className="text-xs text-slate-500">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
