import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MoreHorizontal, Eye, MessageSquare, Clock, User, AlertCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default async function AdminSupportPage() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  // TODO: Replace with actual API call
  const supportTickets = [
    {
      id: 'TKT-001',
      subject: 'Document upload issue',
      category: 'Technical',
      status: 'open',
      priority: 'high',
      createdAt: '2024-12-10T10:00:00Z',
      lastUpdated: '2024-12-11T14:30:00Z',
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        id: 'user123'
      },
      assignedTo: 'Support Team',
      description: 'Unable to upload bank statements. Getting error message when trying to upload PDF files.'
    },
    {
      id: 'TKT-002',
      subject: 'Application status inquiry',
      category: 'General',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-12-08T09:15:00Z',
      lastUpdated: '2024-12-09T16:45:00Z',
      user: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        id: 'user456'
      },
      assignedTo: 'DSA Team',
      description: 'Need clarification on current application status and next steps.'
    },
    {
      id: 'TKT-003',
      subject: 'EMI calculation discrepancy',
      category: 'Financial',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-12-07T14:20:00Z',
      lastUpdated: '2024-12-08T11:30:00Z',
      user: {
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        id: 'user789'
      },
      assignedTo: 'Finance Team',
      description: 'EMI amount shown in portal differs from what was discussed with DSA.'
    },
    {
      id: 'TKT-004',
      subject: 'Login issues',
      category: 'Technical',
      status: 'open',
      priority: 'high',
      createdAt: '2024-12-11T08:45:00Z',
      lastUpdated: '2024-12-11T08:45:00Z',
      user: {
        name: 'Sarah Davis',
        email: 'sarah.davis@example.com',
        id: 'user101'
      },
      assignedTo: 'Tech Support',
      description: 'Cannot login to account. Password reset not working.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-blue-100 text-blue-800';
      case 'Financial':
        return 'bg-purple-100 text-purple-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      case 'Application':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const openTickets = supportTickets.filter(ticket => ticket.status === 'open').length;
  const inProgressTickets = supportTickets.filter(ticket => ticket.status === 'in_progress').length;
  const resolvedTickets = supportTickets.filter(ticket => ticket.status === 'resolved').length;
  const highPriorityTickets = supportTickets.filter(ticket => ticket.priority === 'high').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Support Tickets</h1>
            <p className="text-slate-600">Manage customer support requests and inquiries</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Open Tickets</p>
                  <p className="text-2xl font-bold text-red-600">{openTickets}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">{inProgressTickets}</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">{highPriorityTickets}</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
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
                  placeholder="Search tickets..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
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
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="application">Application</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Table */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>Support Tickets ({supportTickets.length})</CardTitle>
            <CardDescription>All customer support requests</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-700">Ticket</th>
                    <th className="text-left p-4 font-medium text-slate-700">Customer</th>
                    <th className="text-left p-4 font-medium text-slate-700">Category</th>
                    <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 font-medium text-slate-700">Priority</th>
                    <th className="text-left p-4 font-medium text-slate-700">Assigned To</th>
                    <th className="text-left p-4 font-medium text-slate-700">Last Updated</th>
                    <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supportTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-slate-900">#{ticket.id}</div>
                          <div className="text-sm text-slate-600 max-w-xs truncate">{ticket.subject}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Created {new Date(ticket.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{ticket.user.name}</div>
                            <div className="text-sm text-slate-500">{ticket.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getCategoryColor(ticket.category)}>
                          {ticket.category}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">{ticket.assignedTo}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-900">
                          {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(ticket.lastUpdated).toLocaleTimeString()}
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
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              Assign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              Update Status
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
