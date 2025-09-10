import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, UserPlus, MoreHorizontal, Eye, Edit, Trash2, Star, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default async function AdminDSAPage() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  // TODO: Replace with actual API call
  const dsaList = [
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@sbi.co.in',
      dsaId: 'SBI238001EMB',
      bank: 'SBI',
      branchCode: 'SBI001',
      status: 'active',
      joiningDate: '2020-01-15',
      totalApplications: 245,
      approvedApplications: 198,
      successRate: 80.8,
      totalLoanAmount: 125000000,
      rating: 4.7,
      specialization: ['Education Loans', 'Personal Loans'],
      phone: '+91 9876543210'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike.wilson@hdfc.com',
      dsaId: 'HDFC456002EMB',
      bank: 'HDFC',
      branchCode: 'HDFC002',
      status: 'active',
      joiningDate: '2019-08-20',
      totalApplications: 312,
      approvedApplications: 267,
      successRate: 85.6,
      totalLoanAmount: 189000000,
      rating: 4.9,
      specialization: ['Education Loans', 'Home Loans'],
      phone: '+91 9876543211'
    },
    {
      id: '3',
      name: 'Sarah Davis',
      email: 'sarah.davis@icici.com',
      dsaId: 'ICICI789003EMB',
      bank: 'ICICI',
      branchCode: 'ICICI003',
      status: 'inactive',
      joiningDate: '2021-03-10',
      totalApplications: 156,
      approvedApplications: 118,
      successRate: 75.6,
      totalLoanAmount: 87000000,
      rating: 4.3,
      specialization: ['Education Loans'],
      phone: '+91 9876543212'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBankColor = (bank: string) => {
    switch (bank) {
      case 'SBI':
        return 'bg-blue-100 text-blue-800';
      case 'HDFC':
        return 'bg-red-100 text-red-800';
      case 'ICICI':
        return 'bg-orange-100 text-orange-800';
      case 'Axis':
        return 'bg-purple-100 text-purple-800';
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
            <h1 className="text-2xl font-bold text-slate-900">DSA Management</h1>
            <p className="text-slate-600">Manage Direct Sales Agents and their performance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add DSA
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total DSAs</p>
                  <p className="text-2xl font-bold text-slate-900">{dsaList.length}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active DSAs</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {dsaList.filter(dsa => dsa.status === 'active').length}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <UserPlus className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {(dsaList.reduce((sum, dsa) => sum + dsa.successRate, 0) / dsaList.length).toFixed(1)}%
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Loan Amount</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₹{(dsaList.reduce((sum, dsa) => sum + dsa.totalLoanAmount, 0) / 10000000).toFixed(1)}Cr
                  </p>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
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
                  placeholder="Search DSAs..."
                  className="pl-10"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  <SelectItem value="sbi">SBI</SelectItem>
                  <SelectItem value="hdfc">HDFC</SelectItem>
                  <SelectItem value="icici">ICICI</SelectItem>
                  <SelectItem value="axis">Axis</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* DSA Table */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>DSA List ({dsaList.length})</CardTitle>
            <CardDescription>All registered Direct Sales Agents</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-700">DSA Details</th>
                    <th className="text-left p-4 font-medium text-slate-700">Bank</th>
                    <th className="text-left p-4 font-medium text-slate-700">Performance</th>
                    <th className="text-left p-4 font-medium text-slate-700">Status</th>
                    <th className="text-left p-4 font-medium text-slate-700">Rating</th>
                    <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dsaList.map((dsa) => (
                    <tr key={dsa.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <div className="font-semibold text-slate-900">{dsa.name}</div>
                          <div className="text-sm text-slate-500">{dsa.email}</div>
                          <div className="text-xs text-blue-600 mt-1">{dsa.dsaId}</div>
                          <div className="text-xs text-slate-500">{dsa.phone}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <Badge className={getBankColor(dsa.bank)}>
                            {dsa.bank}
                          </Badge>
                          <div className="text-sm text-slate-500 mt-1">{dsa.branchCode}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {dsa.approvedApplications}/{dsa.totalApplications} approved
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            {dsa.successRate}% success rate
                          </div>
                          <div className="text-xs text-slate-500">
                            ₹{(dsa.totalLoanAmount / 10000000).toFixed(1)}Cr total
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(dsa.status)}>
                          {dsa.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-slate-900">{dsa.rating}</span>
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
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit DSA
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Suspend DSA
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
