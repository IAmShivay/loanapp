import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save,
  Camera,
  Shield,
  FileText,
  CreditCard,
  GraduationCap,
  Building
} from 'lucide-react';

export default async function UserProfilePage() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'user') {
    redirect('/login');
  }

  // TODO: Replace with actual API call
  const userProfile = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      dateOfBirth: '1995-05-15',
      profilePicture: null,
      address: '123 Main Street, Sector 15, Bangalore, Karnataka - 560001',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F'
    },
    educationInfo: {
      currentInstitution: 'Stanford University',
      course: 'MS Computer Science',
      yearOfStudy: '1st Year',
      expectedGraduation: '2026-06-15',
      previousEducation: 'B.Tech Computer Science - IIT Delhi (2017)',
      cgpa: '8.5'
    },
    financialInfo: {
      annualIncome: 1200000,
      employmentType: 'Salaried',
      employerName: 'Tech Corp India',
      workExperience: '3 years',
      monthlyIncome: 100000,
      otherIncome: 0
    },
    applicationStats: {
      totalApplications: 2,
      approvedApplications: 1,
      pendingApplications: 1,
      rejectedApplications: 0,
      totalLoanAmount: 500000,
      activeLoanAmount: 500000
    },
    documents: {
      aadharCard: { status: 'verified', uploadedAt: '2024-12-01' },
      panCard: { status: 'verified', uploadedAt: '2024-12-01' },
      incomeProof: { status: 'verified', uploadedAt: '2024-12-02' },
      bankStatements: { status: 'pending', uploadedAt: '2024-12-10' },
      admissionLetter: { status: 'verified', uploadedAt: '2024-12-01' },
      academicTranscripts: { status: 'verified', uploadedAt: '2024-12-01' }
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-600">Manage your personal information and preferences</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white border border-slate-200">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={userProfile.personalInfo.profilePicture || undefined} />
                    <AvatarFallback className="bg-blue-600 text-white text-xl">
                      {getInitials(userProfile.personalInfo.firstName, userProfile.personalInfo.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {userProfile.personalInfo.firstName} {userProfile.personalInfo.lastName}
                </h3>
                <p className="text-slate-600 mb-2">{userProfile.educationInfo.course}</p>
                <Badge className="bg-blue-100 text-blue-800 mb-4">
                  {userProfile.educationInfo.currentInstitution}
                </Badge>
                <div className="text-sm text-slate-600">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <GraduationCap className="h-4 w-4" />
                    {userProfile.educationInfo.yearOfStudy}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Expected Graduation: {new Date(userProfile.educationInfo.expectedGraduation).getFullYear()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Stats */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Application Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{userProfile.applicationStats.totalApplications}</div>
                    <div className="text-sm text-slate-600">Total Applications</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{userProfile.applicationStats.approvedApplications}</div>
                    <div className="text-sm text-slate-600">Approved</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">
                    ₹{(userProfile.applicationStats.activeLoanAmount / 100000).toFixed(1)}L
                  </div>
                  <div className="text-sm text-slate-600">Active Loan Amount</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">
                    {userProfile.applicationStats.pendingApplications}
                  </div>
                  <div className="text-sm text-slate-600">Pending Applications</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
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
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={userProfile.personalInfo.firstName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={userProfile.personalInfo.lastName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={userProfile.personalInfo.email} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={userProfile.personalInfo.phone} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      value={new Date(userProfile.personalInfo.dateOfBirth).toLocaleDateString()} 
                      readOnly 
                    />
                  </div>
                  <div>
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input id="panNumber" value={userProfile.personalInfo.panNumber} readOnly />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={userProfile.personalInfo.address} readOnly rows={2} />
                </div>
              </CardContent>
            </Card>

            {/* Education Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Education Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentInstitution">Current Institution</Label>
                    <Input id="currentInstitution" value={userProfile.educationInfo.currentInstitution} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input id="course" value={userProfile.educationInfo.course} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="yearOfStudy">Year of Study</Label>
                    <Input id="yearOfStudy" value={userProfile.educationInfo.yearOfStudy} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input id="cgpa" value={userProfile.educationInfo.cgpa} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                    <Input 
                      id="expectedGraduation" 
                      value={new Date(userProfile.educationInfo.expectedGraduation).toLocaleDateString()} 
                      readOnly 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="previousEducation">Previous Education</Label>
                  <Input id="previousEducation" value={userProfile.educationInfo.previousEducation} readOnly />
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Input id="employmentType" value={userProfile.financialInfo.employmentType} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input id="employerName" value={userProfile.financialInfo.employerName} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="workExperience">Work Experience</Label>
                    <Input id="workExperience" value={userProfile.financialInfo.workExperience} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="annualIncome">Annual Income</Label>
                    <Input 
                      id="annualIncome" 
                      value={`₹${userProfile.financialInfo.annualIncome.toLocaleString()}`} 
                      readOnly 
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyIncome">Monthly Income</Label>
                    <Input 
                      id="monthlyIncome" 
                      value={`₹${userProfile.financialInfo.monthlyIncome.toLocaleString()}`} 
                      readOnly 
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherIncome">Other Income</Label>
                    <Input 
                      id="otherIncome" 
                      value={`₹${userProfile.financialInfo.otherIncome.toLocaleString()}`} 
                      readOnly 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Status */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Document Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(userProfile.documents).map(([key, doc]) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-xs text-slate-500">
                            Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getDocumentStatusColor(doc.status)} >
                        {doc.status}
                      </Badge>
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
