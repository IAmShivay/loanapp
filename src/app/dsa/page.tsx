import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, FileText, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DSADashboard() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'dsa') {
    redirect('/login');
  }

  // Mock data - in real app, fetch from database
  const stats = {
    assignedApplications: 12,
    pendingReview: 3,
    approvedApplications: 45,
    rejectedApplications: 8,
    averageProcessingTime: '2.3 days',
    successRate: 85,
  };

  const pendingApplications = [
    {
      id: 'LA202412001',
      applicant: 'John Doe',
      amount: '₹5,00,000',
      purpose: 'Home Loan',
      submittedAt: '2024-12-10',
      deadline: '2024-12-13',
      daysLeft: 1,
    },
    {
      id: 'LA202412005',
      applicant: 'Alice Brown',
      amount: '₹3,50,000',
      purpose: 'Personal Loan',
      submittedAt: '2024-12-11',
      deadline: '2024-12-14',
      daysLeft: 2,
    },
    {
      id: 'LA202412008',
      applicant: 'Robert Wilson',
      amount: '₹7,50,000',
      purpose: 'Business Loan',
      submittedAt: '2024-12-11',
      deadline: '2024-12-14',
      daysLeft: 2,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl lg:rounded-2xl shadow-sm border border-primary/10 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">Welcome back, {session.user.firstName}!</h1>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <p className="text-sm font-semibold text-primary">
                    DSA ID: {session.user.dsaId}
                  </p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-full">
                  <p className="text-sm font-semibold text-blue-600">
                    {session.user.bankName} Bank
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Success Rate</p>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-green-600">{stats.successRate}%</div>
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Assigned Applications"
            value={stats.assignedApplications}
            description="Total assigned to you"
            icon="FileText"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            description="Awaiting your action"
            icon="Clock"
            className="border-orange-200 bg-orange-50"
          />
          <StatCard
            title="Approved"
            value={stats.approvedApplications}
            description="Successfully processed"
            icon="CheckCircle"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Rejected"
            value={stats.rejectedApplications}
            description="Applications declined"
            icon="XCircle"
          />
        </div>

        {/* Urgent Actions */}
        {stats.pendingReview > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-800">Urgent: Applications Pending Review</CardTitle>
              </div>
              <CardDescription className="text-orange-700">
                You have {stats.pendingReview} applications that need immediate attention to meet the 3-day deadline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dsa/applications">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Review Applications Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Pending Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Applications Pending Review</CardTitle>
            <CardDescription>Applications assigned to you that require action</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApplications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No pending applications</p>
                <p className="text-sm">Great job! You&apos;re all caught up.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{app.applicant}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.daysLeft <= 1 ? 'bg-red-100 text-red-800' :
                          app.daysLeft <= 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {app.daysLeft} day{app.daysLeft !== 1 ? 's' : ''} left
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-medium">Application ID</p>
                          <p>{app.id}</p>
                        </div>
                        <div>
                          <p className="font-medium">Amount</p>
                          <p>{app.amount}</p>
                        </div>
                        <div>
                          <p className="font-medium">Purpose</p>
                          <p>{app.purpose}</p>
                        </div>
                        <div>
                          <p className="font-medium">Submitted</p>
                          <p>{app.submittedAt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>This Month&apos;s Performance</CardTitle>
              <CardDescription>Your processing statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applications Processed</span>
                  <span className="font-medium">{stats.approvedApplications + stats.rejectedApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">{stats.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Processing Time</span>
                  <span className="font-medium">{stats.averageProcessingTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bank</span>
                  <span className="font-medium">{session.user.bankName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/dsa/applications">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Applications
                  </Button>
                </Link>
                <Link href="/dsa/chat">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Active Chats
                  </Button>
                </Link>
                <Link href="/dsa/support">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Create Support Ticket
                  </Button>
                </Link>
                <Link href="/dsa/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
