import { getAuthSession } from '@/lib/auth/utils';
import { redirect, notFound } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Download, 
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
  MapPin,
  Edit,
  MessageSquare,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface DSAApplicationDetailPageProps {
  params: {
    id: string;
  };
}

export default async function DSAApplicationDetailPage({ params }: DSAApplicationDetailPageProps) {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'dsa') {
    redirect('/login');
  }

  // TODO: Replace with actual API call - ensure application is assigned to this DSA
  const application = {
    id: params.id,
    applicationId: 'LA202412001',
    status: 'pending_review',
    priority: 'high',
    submittedAt: '2024-12-10T10:30:00Z',
    lastUpdated: '2024-12-11T14:20:00Z',
    deadline: '2024-12-13T23:59:59Z',
    
    // Applicant Information
    applicant: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      dateOfBirth: '1995-05-15',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F',
      address: '123 Main Street, Sector 15, Bangalore, Karnataka - 560001'
    },
    
    // Education Information
    education: {
      institution: 'Stanford University',
      course: 'MS Computer Science',
      duration: '2 years',
      admissionDate: '2024-09-01',
      feeStructure: 5000000,
      country: 'USA'
    },
    
    // Loan Information
    loan: {
      amount: 500000,
      purpose: 'Masters in Computer Science at Stanford University. The program covers advanced topics in AI, Machine Learning, and Software Engineering.',
      annualIncome: 1200000,
      employmentType: 'Salaried',
      employerName: 'Tech Corp India'
    },
    
    // Documents
    documents: [
      { name: 'Aadhar Card', key: 'aadhar', status: 'submitted', uploadedAt: '2024-12-10', verified: true },
      { name: 'PAN Card', key: 'pan', status: 'submitted', uploadedAt: '2024-12-10', verified: true },
      { name: 'Income Proof', key: 'income', status: 'submitted', uploadedAt: '2024-12-10', verified: false },
      { name: 'Admission Letter', key: 'admission', status: 'submitted', uploadedAt: '2024-12-10', verified: true },
      { name: 'Bank Statements', key: 'bank_statements', status: 'pending', uploadedAt: null, verified: false },
      { name: 'Collateral Documents', key: 'collateral', status: 'pending', uploadedAt: null, verified: false }
    ],
    
    // Risk Assessment
    riskAssessment: {
      creditScore: 750,
      riskLevel: 'Medium',
      incomeToLoanRatio: 2.4,
      recommendations: [
        'Applicant has good credit score',
        'Income is sufficient for loan amount',
        'Requires collateral for international education',
        'Consider co-applicant for better terms'
      ]
    },
    
    // Comments/Notes
    comments: [
      {
        id: '1',
        author: 'System',
        message: 'Application automatically assigned based on specialization',
        timestamp: '2024-12-10T10:35:00Z',
        type: 'system'
      },
      {
        id: '2',
        author: 'Jane Smith (DSA)',
        message: 'Initial review completed. Need bank statements and collateral documents.',
        timestamp: '2024-12-11T14:20:00Z',
        type: 'dsa'
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
      case 'pending_review':
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

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusColor = (status: string, verified: boolean) => {
    if (status === 'submitted' && verified) {
      return 'bg-green-100 text-green-800';
    } else if (status === 'submitted' && !verified) {
      return 'bg-blue-100 text-blue-800';
    } else if (status === 'pending') {
      return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getDaysLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft(application.deadline);
  const isUrgent = daysLeft <= 1;

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dsa/applications">
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
              <Badge className={getPriorityColor(application.priority)}>
                {application.priority} priority
              </Badge>
              {isUrgent && (
                <Badge className="bg-red-100 text-red-800">
                  Urgent - {daysLeft} days left
                </Badge>
              )}
            </div>
            <p className="text-slate-600">
              Submitted on {new Date(application.submittedAt).toLocaleDateString()} • 
              Deadline: {new Date(application.deadline).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button variant="outline" >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    <p className="text-slate-900">{application.applicant.firstName} {application.applicant.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Date of Birth</label>
                    <p className="text-slate-900">{new Date(application.applicant.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <p className="text-slate-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {application.applicant.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    <p className="text-slate-900 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {application.applicant.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Aadhar Number</label>
                    <p className="text-slate-900">{application.applicant.aadharNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">PAN Number</label>
                    <p className="text-slate-900">{application.applicant.panNumber}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Address</label>
                  <p className="text-slate-900 flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                    {application.applicant.address}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Education & Loan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Education Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Institution</label>
                    <p className="text-slate-900 font-medium">{application.education.institution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Course</label>
                    <p className="text-slate-900">{application.education.course}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Duration</label>
                    <p className="text-slate-900">{application.education.duration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Country</label>
                    <p className="text-slate-900">{application.education.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Total Fee</label>
                    <p className="text-slate-900 font-semibold">₹{application.education.feeStructure.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Loan & Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Loan Amount</label>
                    <p className="text-2xl font-bold text-blue-600">₹{application.loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Annual Income</label>
                    <p className="text-slate-900">₹{application.loan.annualIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Employment</label>
                    <p className="text-slate-900">{application.loan.employmentType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Employer</label>
                    <p className="text-slate-900">{application.loan.employerName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Document Verification
                </CardTitle>
                <CardDescription>
                  Review and verify submitted documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {application.documents.map((doc) => (
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
                        <Badge className={getDocumentStatusColor(doc.status, doc.verified)} >
                          {doc.status === 'submitted' ? (doc.verified ? 'Verified' : 'Pending Review') : 'Pending'}
                        </Badge>
                        {doc.status === 'submitted' && (
                          <Button  variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Assessment */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{application.riskAssessment.creditScore}</div>
                  <div className="text-sm text-slate-600">Credit Score</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Risk Level</span>
                  <Badge className={getRiskColor(application.riskAssessment.riskLevel)}>
                    {application.riskAssessment.riskLevel}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Income Ratio</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {application.riskAssessment.incomeToLoanRatio}x
                  </span>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {application.riskAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                        <span className="text-blue-600 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Action Panel */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle>Application Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Update Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="rejected">Reject</SelectItem>
                      <SelectItem value="more_info_required">Request More Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Comments</label>
                  <Textarea 
                    placeholder="Add your comments or feedback..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Request Documents
                </Button>
              </CardContent>
            </Card>

            {/* Comments History */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Comments & Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {application.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-900">{comment.author}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{comment.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
