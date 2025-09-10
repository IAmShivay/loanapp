import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { StatCard } from '@/components/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminDashboard() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login');
  }

  // Mock data - in real app, fetch from database
  const stats = {
    totalUsers: 1250,
    totalApplications: 485,
    pendingApplications: 23,
    approvedApplications: 342,
    rejectedApplications: 120,
    activeDSAs: 15,
    totalTickets: 67,
    openTickets: 12,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl lg:rounded-2xl shadow-sm border border-primary/10 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {session.user.firstName}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Here&apos;s what&apos;s happening with your loan management system today.
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-sm text-muted-foreground font-medium">System Status</p>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            description="All registered users"
            icon="Users"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Total Applications"
            value={stats.totalApplications.toLocaleString()}
            description="Loan applications"
            icon="FileText"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Pending Applications"
            value={stats.pendingApplications}
            description="Awaiting review"
            icon="Clock"
          />
          <StatCard
            title="Active DSAs"
            value={stats.activeDSAs}
            description="Verified DSAs"
            icon="TrendingUp"
            trend={{ value: 2, isPositive: true }}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Approved Applications"
            value={stats.approvedApplications}
            description="Successfully processed"
            icon="CheckCircle"
          />
          <StatCard
            title="Support Tickets"
            value={stats.totalTickets}
            description={`${stats.openTickets} open tickets`}
            icon="HelpCircle"
          />
          <StatCard
            title="Rejection Rate"
            value={`${Math.round((stats.rejectedApplications / stats.totalApplications) * 100)}%`}
            description="Of total applications"
            icon="FileText"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Applications</CardTitle>
              <CardDescription className="text-slate-600">Latest loan applications submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'LA202412001', user: 'John Doe', amount: '₹5,00,000', status: 'pending' },
                  { id: 'LA202412002', user: 'Jane Smith', amount: '₹3,50,000', status: 'under_review' },
                  { id: 'LA202412003', user: 'Mike Johnson', amount: '₹7,50,000', status: 'approved' },
                  { id: 'LA202412004', user: 'Sarah Wilson', amount: '₹2,25,000', status: 'pending' },
                ].map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="font-semibold text-slate-900">{app.user}</p>
                      <p className="text-sm text-slate-500">{app.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{app.amount}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        app.status === 'approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DSA Performance</CardTitle>
              <CardDescription>Top performing DSAs this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'John Smith', bank: 'SBI', applications: 23, approved: 18 },
                  { name: 'Mary Johnson', bank: 'HDFC', applications: 19, approved: 15 },
                  { name: 'David Brown', bank: 'ICICI', applications: 17, approved: 12 },
                  { name: 'Lisa Davis', bank: 'AXIS', applications: 15, approved: 11 },
                ].map((dsa, index) => (
                  <div key={dsa.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{dsa.name}</p>
                        <p className="text-sm text-gray-600">{dsa.bank} Bank</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{dsa.approved}/{dsa.applications}</p>
                      <p className="text-sm text-gray-600">
                        {Math.round((dsa.approved / dsa.applications) * 100)}% success
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
