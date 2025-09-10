import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, FileText, Eye, Download, Upload, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function UserApplicationsPage() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'user') {
    redirect('/login');
  }

  // TODO: Replace with actual API call - filter by user ID
  const applications = [
    {
      id: 'LA202412001',
      loanAmount: 500000,
      purpose: 'Masters in Computer Science',
      institution: 'Stanford University',
      course: 'MS Computer Science',
      duration: '2 years',
      status: 'under_review',
      submittedAt: '2024-12-10T10:30:00Z',
      lastUpdated: '2024-12-11T14:20:00Z',
      dsaName: 'Jane Smith',
      dsaBank: 'SBI',
      dsaContact: '+91 9876543210',
      documents: {
        required: ['aadhar', 'pan', 'income_proof', 'admission_letter', 'bank_statements', 'collateral_docs'],
        submitted: ['aadhar', 'pan', 'income_proof', 'admission_letter'],
        pending: ['bank_statements', 'collateral_docs']
      },
      timeline: [
        { date: '2024-12-10', status: 'submitted', description: 'Application submitted successfully' },
        { date: '2024-12-10', status: 'assigned', description: 'Assigned to DSA Jane Smith (SBI)' },
        { date: '2024-12-11', status: 'document_request', description: 'Additional documents requested' }
      ]
    },
    {
      id: 'LA202411028',
      loanAmount: 300000,
      purpose: 'Engineering Degree',
      institution: 'IIT Delhi',
      course: 'B.Tech Computer Science',
      duration: '4 years',
      status: 'approved',
      submittedAt: '2024-11-28T09:15:00Z',
      lastUpdated: '2024-12-02T16:45:00Z',
      approvedAt: '2024-12-02T16:45:00Z',
      dsaName: 'Mike Wilson',
      dsaBank: 'HDFC',
      dsaContact: '+91 9876543211',
      loanAccountNumber: 'HDFC789012345',
      documents: {
        required: ['aadhar', 'pan', 'income_proof', 'admission_letter', 'bank_statements'],
        submitted: ['aadhar', 'pan', 'income_proof', 'admission_letter', 'bank_statements'],
        pending: []
      },
      timeline: [
        { date: '2024-11-28', status: 'submitted', description: 'Application submitted successfully' },
        { date: '2024-11-29', status: 'assigned', description: 'Assigned to DSA Mike Wilson (HDFC)' },
        { date: '2024-12-01', status: 'under_review', description: 'Application under review' },
        { date: '2024-12-02', status: 'approved', description: 'Loan approved - ₹3,00,000' }
      ]
    },
    {
      id: 'LA202411015',
      loanAmount: 750000,
      purpose: 'MBA Program',
      institution: 'ISB Hyderabad',
      course: 'MBA',
      duration: '2 years',
      status: 'rejected',
      submittedAt: '2024-11-15T14:20:00Z',
      lastUpdated: '2024-11-20T11:30:00Z',
      rejectedAt: '2024-11-20T11:30:00Z',
      dsaName: 'Sarah Davis',
      dsaBank: 'ICICI',
      dsaContact: '+91 9876543212',
      rejectionReason: 'Insufficient income documentation and collateral requirements not met',
      documents: {
        required: ['aadhar', 'pan', 'income_proof', 'admission_letter', 'bank_statements', 'collateral_docs'],
        submitted: ['aadhar', 'pan', 'admission_letter'],
        pending: ['income_proof', 'bank_statements', 'collateral_docs']
      },
      timeline: [
        { date: '2024-11-15', status: 'submitted', description: 'Application submitted successfully' },
        { date: '2024-11-16', status: 'assigned', description: 'Assigned to DSA Sarah Davis (ICICI)' },
        { date: '2024-11-18', status: 'document_request', description: 'Additional documents requested' },
        { date: '2024-11-20', status: 'rejected', description: 'Application rejected - Insufficient documentation' }
      ]
    }
  ];

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
      case 'document_pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'document_pending':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-600">Track and manage your education loan applications</p>
          </div>
          <Link href="/user/applications/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Applications</p>
                  <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
                </div>
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Under Review</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {applications.filter(app => app.status === 'under_review').length}
                  </p>
                </div>
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{(applications.reduce((sum, app) => sum + app.loanAmount, 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search applications..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="bg-white border border-slate-200 hover:shadow-md transition-all">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{app.id}</h3>
                          {getStatusIcon(app.status)}
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">
                          Submitted {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">₹{(app.loanAmount / 100000).toFixed(1)}L</p>
                        <p className="text-sm text-slate-500">{app.duration}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Institution</p>
                        <p className="text-sm text-slate-900">{app.institution}</p>
                        <p className="text-xs text-slate-500">{app.course}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">DSA Assigned</p>
                        <p className="text-sm text-slate-900">{app.dsaName}</p>
                        <p className="text-xs text-slate-500">{app.dsaBank} Bank</p>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Document Status</p>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">{app.documents.submitted.length} submitted</span>
                        </div>
                        {app.documents.pending.length > 0 && (
                          <div className="text-sm">
                            <span className="text-orange-600 font-medium">{app.documents.pending.length} pending</span>
                          </div>
                        )}
                        <div className="text-sm text-slate-500">
                          of {app.documents.required.length} required
                        </div>
                      </div>
                    </div>

                    {/* Special Messages */}
                    {app.status === 'approved' && app.loanAccountNumber && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <CheckCircle className="h-4 w-4 inline mr-1" />
                          Loan approved! Account Number: <strong>{app.loanAccountNumber}</strong>
                        </p>
                      </div>
                    )}

                    {app.status === 'rejected' && app.rejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <XCircle className="h-4 w-4 inline mr-1" />
                          Rejection Reason: {app.rejectionReason}
                        </p>
                      </div>
                    )}

                    {app.documents.pending.length > 0 && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-800">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          Please upload pending documents: {app.documents.pending.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link href={`/user/applications/${app.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {app.documents.pending.length > 0 && (
                      <Button size="sm" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Docs
                      </Button>
                    )}
                    {app.status === 'approved' && (
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
