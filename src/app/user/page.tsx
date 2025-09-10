import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, MessageSquare, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function UserDashboard() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'user') {
    redirect('/login');
  }

  // Mock data - in real app, fetch from database
  const stats = {
    totalApplications: 3,
    pendingApplications: 1,
    approvedApplications: 1,
    rejectedApplications: 1,
  };

  const applications = [
    {
      id: 'LA202412001',
      amount: '₹5,00,000',
      purpose: 'Home Loan',
      status: 'under_review',
      submittedAt: '2024-12-10',
      dsaName: 'John Smith',
      bank: 'SBI',
    },
    {
      id: 'LA202411025',
      amount: '₹2,50,000',
      purpose: 'Personal Loan',
      status: 'approved',
      submittedAt: '2024-11-15',
      dsaName: 'Mary Johnson',
      bank: 'HDFC',
      approvedAt: '2024-11-18',
    },
    {
      id: 'LA202411010',
      amount: '₹7,50,000',
      purpose: 'Business Loan',
      status: 'rejected',
      submittedAt: '2024-11-01',
      dsaName: 'David Brown',
      bank: 'ICICI',
      rejectedAt: '2024-11-05',
      rejectionReason: 'Insufficient income documentation',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.firstName}!</h1>
            <p className="text-gray-600 mt-2">Manage your loan applications and track their progress.</p>
          </div>
          <Link href="/user/applications/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            description="All your applications"
            icon="FileText"
          />
          <StatCard
            title="Under Review"
            value={stats.pendingApplications}
            description="Being processed"
            icon="Clock"
            className="border-blue-200 bg-blue-50"
          />
          <StatCard
            title="Approved"
            value={stats.approvedApplications}
            description="Successfully approved"
            icon="CheckCircle"
            className="border-green-200 bg-green-50"
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedApplications}
            description="Need attention"
            icon="FileText"
            className="border-red-200 bg-red-50"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/user/applications/new">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Apply for Loan
                </Button>
              </Link>
              <Link href="/user/calculator">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Calculator className="h-6 w-6 mb-2" />
                  EMI Calculator
                </Button>
              </Link>
              <Link href="/user/chat">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  Chat with DSA
                </Button>
              </Link>
              <Link href="/user/support">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Applications</CardTitle>
                <CardDescription>Track the status of your loan applications</CardDescription>
              </div>
              <Link href="/user/applications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No applications yet</p>
                <p className="text-sm mb-4">Start by applying for your first loan</p>
                <Link href="/user/applications/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{app.purpose}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <p className="font-medium">Application ID</p>
                        <p>{app.id}</p>
                      </div>
                      <div>
                        <p className="font-medium">Amount</p>
                        <p className="font-semibold text-gray-900">{app.amount}</p>
                      </div>
                      <div>
                        <p className="font-medium">DSA</p>
                        <p>{app.dsaName}</p>
                      </div>
                      <div>
                        <p className="font-medium">Bank</p>
                        <p>{app.bank}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Submitted: {app.submittedAt}</span>
                      {app.status === 'approved' && app.approvedAt && (
                        <span className="text-green-600">Approved: {app.approvedAt}</span>
                      )}
                      {app.status === 'rejected' && app.rejectedAt && (
                        <span className="text-red-600">Rejected: {app.rejectedAt}</span>
                      )}
                    </div>

                    {app.status === 'rejected' && app.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Reason:</strong> {app.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips and Information */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Application Tips</CardTitle>
            <CardDescription>Helpful information to improve your application success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Required Documents</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aadhar Card</li>
                  <li>• PAN Card</li>
                  <li>• Income Proof (Salary slips/ITR)</li>
                  <li>• Bank Statements (6 months)</li>
                  <li>• Address Proof</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Application Process</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Fill application form completely</li>
                  <li>• Upload all required documents</li>
                  <li>• DSA will review within 3 days</li>
                  <li>• Chat with DSA for any queries</li>
                  <li>• Track status in real-time</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
