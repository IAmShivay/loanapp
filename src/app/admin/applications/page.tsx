import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, FileText, MoreHorizontal, Eye, Edit, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default async function AdminApplicationsPage() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  // TODO: Replace with actual API call
  const applications = [
    {
      id: 'LA202412001',
      applicantName: 'John Doe',
      applicantEmail: 'john@example.com',
      loanType: 'Education Loan',
      amount: 500000,
      purpose: 'Masters in Computer Science',
      institution: 'Stanford University',
      status: 'under_review',
      dsaName: 'Jane Smith',
      dsaBank: 'SBI',
      submittedAt: '2024-12-10',
      reviewedAt: null,
      priority: 'high'
    },
    {
      id: 'LA202412002',
      applicantName: 'Alice Johnson',
      applicantEmail: 'alice@example.com',
      loanType: 'Education Loan',
      amount: 750000,
      purpose: 'MBA Program',
      institution: 'Harvard Business School',
      status: 'approved',
      dsaName: 'Mike Wilson',
      dsaBank: 'HDFC',
      submittedAt: '2024-12-08',
      reviewedAt: '2024-12-09',
      priority: 'medium'
    },
    {
      id: 'LA202412003',
      applicantName: 'Bob Smith',
      applicantEmail: 'bob@example.com',
      loanType: 'Education Loan',
      amount: 300000,
      purpose: 'Engineering Degree',
      institution: 'IIT Delhi',
      status: 'rejected',
      dsaName: 'Sarah Davis',
      dsaBank: 'ICICI',
      submittedAt: '2024-12-07',
      reviewedAt: '2024-12-08',
      priority: 'low'
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

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Education Loan Applications</h1>
            <p className="text-slate-600">Monitor and manage all education loan applications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Applications</p>
                  <p className="text-2xl font-bold text-slate-900">{applications.length}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
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
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
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
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{(applications.reduce((sum, app) => sum + app.amount, 0) / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
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
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Applications ({applications.length})</CardTitle>
            <CardDescription>All education loan applications in the system</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-700">Application</th>
                    <th className="text-left p-4 font-medium text-slate-700">Applicant</th>
                    <th className="text-left p-4 font-medium text-slate-700">Amount</th>
                    <th className="text-left p-4 font-medium text-slate-700">Institution</th>
                    <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 font-medium text-slate-700">DSA</th>
                    <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-slate-900">{app.id}</div>
                          <div className="text-sm text-slate-500">{app.submittedAt}</div>
                          <Badge className={getPriorityColor(app.priority)}>
                            {app.priority}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-slate-900">{app.applicantName}</div>
                          <div className="text-sm text-slate-500">{app.applicantEmail}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold">₹{(app.amount / 100000).toFixed(1)}L</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-slate-900">{app.institution}</div>
                          <div className="text-sm text-slate-500">{app.purpose}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-slate-900">{app.dsaName}</div>
                          <div className="text-sm text-slate-500">{app.dsaBank}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download Documents
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
