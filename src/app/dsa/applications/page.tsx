'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, FileText, MoreHorizontal, Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation
} from '@/store/api/apiSlice';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { safeString, safeNumber, safeDate, formatCurrency } from '@/lib/utils/fallbacks';
import { toast } from 'sonner';

export default function DSAApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session?.user || session.user.role !== 'dsa') {
    router.push('/login');
    return null;
  }

  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // RTK Query hooks
  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError,
    refetch: refetchApplications
  } = useGetApplicationsQuery({
    status: statusFilter || undefined,
    search: searchTerm || undefined,
    limit: 50,
    page: 1
  });

  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const applications = applicationsData?.applications || [];

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      await updateApplicationStatus({ applicationId, status: newStatus }).unwrap();
      toast.success('Application status updated successfully');
      refetchApplications();
    } catch (error) {
      toast.error('Failed to update application status');
      console.error('Error updating application:', error);
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under_review':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'pending_review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysLeft = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (applicationsLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Application Queue</h1>
            <p className="text-slate-600">Review and process education loan applications assigned to you</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Review</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {applications.filter(app => app.status === 'pending_review').length}
                  </p>
                </div>
                <Clock className="h-5 w-5 text-yellow-600" />
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
                  <p className="text-sm font-medium text-slate-600">Approved Today</p>
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
                    ₹{(applications.reduce((sum, app) => sum + safeNumber(app.loanInfo?.amount, 0), 0) / 100000).toFixed(1)}L
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
                  <SelectItem value="pending_review">Pending Review</SelectItem>
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

        {/* Applications List */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {applications.map((app) => {
            const daysLeft = getDaysLeft(app.deadline);
            const isUrgent = daysLeft <= 1;
            
            return (
              <Card key={app.id} className={`bg-white border transition-all hover:shadow-md ${
                isUrgent ? 'border-red-200 bg-red-50/30' : 'border-slate-200'
              }`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{app.id}</h3>
                            <Badge className={getPriorityColor(app.priority)} >
                              {app.priority}
                            </Badge>
                            {isUrgent && (
                              <Badge className="bg-red-100 text-red-800" >
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">
                            Submitted {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Applicant</p>
                          <p className="text-sm text-slate-900">{app.applicantName}</p>
                          <p className="text-xs text-slate-500">{app.applicantEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Institution</p>
                          <p className="text-sm text-slate-900">{app.institution}</p>
                          <p className="text-xs text-slate-500">{app.course}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Loan Amount</p>
                          <p className="text-sm font-semibold text-slate-900">₹{(app.loanAmount / 100000).toFixed(1)}L</p>
                          <p className="text-xs text-slate-500">{app.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-slate-600">Documents: </span>
                            <span className="font-medium text-slate-900">
                              {app.completedDocuments}/{app.totalDocuments}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-slate-600">Deadline: </span>
                            <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-slate-900'}`}>
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/dsa/applications/${app.id}`}>
                        <Button variant="outline"  className="w-full sm:w-auto">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </Link>
                      {app.status === 'pending_review' && (
                        <Button  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                          <Edit className="h-4 w-4 mr-2" />
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
