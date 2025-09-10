'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Send, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

// Form validation schema
const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  aadharNumber: z.string().length(12, 'Aadhar number must be 12 digits'),
  panNumber: z.string().length(10, 'PAN number must be 10 characters'),
  
  // Address Information
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  
  // Education Information
  institution: z.string().min(2, 'Institution name is required'),
  course: z.string().min(2, 'Course name is required'),
  duration: z.string().min(1, 'Course duration is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  feeStructure: z.number().min(1000, 'Fee structure must be at least ₹1,000'),
  
  // Loan Information
  loanAmount: z.number().min(50000, 'Loan amount must be at least ₹50,000').max(5000000, 'Loan amount cannot exceed ₹50,00,000'),
  purpose: z.string().min(10, 'Purpose must be at least 10 characters'),
  
  // Financial Information
  annualIncome: z.number().min(100000, 'Annual income must be at least ₹1,00,000'),
  employmentType: z.string().min(1, 'Employment type is required'),
  employerName: z.string().min(2, 'Employer name is required'),
  
  // Co-applicant Information (optional)
  hasCoApplicant: z.boolean(),
  coApplicantName: z.string().optional(),
  coApplicantRelation: z.string().optional(),
  coApplicantIncome: z.number().optional(),
  
  // Terms and Conditions
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms and conditions'),
  agreeToDataProcessing: z.boolean().refine(val => val === true, 'You must agree to data processing')
});

type FormData = z.infer<typeof applicationSchema>;

export default function NewApplicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    hasCoApplicant: false,
    agreeToTerms: false,
    agreeToDataProcessing: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    'Personal Information',
    'Address Details',
    'Education Information',
    'Loan Details',
    'Financial Information',
    'Review & Submit'
  ];

  const handleInputChange = (field: keyof FormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName) stepErrors.firstName = 'First name is required';
        if (!formData.lastName) stepErrors.lastName = 'Last name is required';
        if (!formData.email) stepErrors.email = 'Email is required';
        if (!formData.phone) stepErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) stepErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.aadharNumber) stepErrors.aadharNumber = 'Aadhar number is required';
        if (!formData.panNumber) stepErrors.panNumber = 'PAN number is required';
        break;
      case 2: // Address
        if (!formData.address) stepErrors.address = 'Address is required';
        if (!formData.city) stepErrors.city = 'City is required';
        if (!formData.state) stepErrors.state = 'State is required';
        if (!formData.pincode) stepErrors.pincode = 'Pincode is required';
        break;
      case 3: // Education
        if (!formData.institution) stepErrors.institution = 'Institution is required';
        if (!formData.course) stepErrors.course = 'Course is required';
        if (!formData.duration) stepErrors.duration = 'Duration is required';
        if (!formData.admissionDate) stepErrors.admissionDate = 'Admission date is required';
        if (!formData.feeStructure) stepErrors.feeStructure = 'Fee structure is required';
        break;
      case 4: // Loan Details
        if (!formData.loanAmount) stepErrors.loanAmount = 'Loan amount is required';
        if (!formData.purpose) stepErrors.purpose = 'Purpose is required';
        break;
      case 5: // Financial Information
        if (!formData.annualIncome) stepErrors.annualIncome = 'Annual income is required';
        if (!formData.employmentType) stepErrors.employmentType = 'Employment type is required';
        if (!formData.employerName) stepErrors.employerName = 'Employer name is required';
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);
      
      // Validate entire form
      const validatedData = applicationSchema.parse(formData);
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application ID is ${result.applicationId}. You will receive updates via email.`,
      });

      router.push('/user/applications');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={errors.dateOfBirth ? 'border-red-500' : ''}
                />
                {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber || ''}
                  onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                  className={errors.aadharNumber ? 'border-red-500' : ''}
                  maxLength={12}
                />
                {errors.aadharNumber && <p className="text-sm text-red-600 mt-1">{errors.aadharNumber}</p>}
              </div>
              <div>
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  value={formData.panNumber || ''}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  className={errors.panNumber ? 'border-red-500' : ''}
                  maxLength={10}
                />
                {errors.panNumber && <p className="text-sm text-red-600 mt-1">{errors.panNumber}</p>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Complete Address *</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-sm text-red-600 mt-1">{errors.state}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode || ''}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className={errors.pincode ? 'border-red-500' : ''}
                maxLength={6}
              />
              {errors.pincode && <p className="text-sm text-red-600 mt-1">{errors.pincode}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="institution">Educational Institution *</Label>
              <Input
                id="institution"
                value={formData.institution || ''}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                className={errors.institution ? 'border-red-500' : ''}
                placeholder="e.g., Stanford University, IIT Delhi"
              />
              {errors.institution && <p className="text-sm text-red-600 mt-1">{errors.institution}</p>}
            </div>
            <div>
              <Label htmlFor="course">Course/Program *</Label>
              <Input
                id="course"
                value={formData.course || ''}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className={errors.course ? 'border-red-500' : ''}
                placeholder="e.g., Masters in Computer Science, MBA"
              />
              {errors.course && <p className="text-sm text-red-600 mt-1">{errors.course}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Course Duration *</Label>
                <Select onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 year">1 Year</SelectItem>
                    <SelectItem value="2 years">2 Years</SelectItem>
                    <SelectItem value="3 years">3 Years</SelectItem>
                    <SelectItem value="4 years">4 Years</SelectItem>
                    <SelectItem value="5 years">5 Years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.duration && <p className="text-sm text-red-600 mt-1">{errors.duration}</p>}
              </div>
              <div>
                <Label htmlFor="admissionDate">Admission Date *</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate || ''}
                  onChange={(e) => handleInputChange('admissionDate', e.target.value)}
                  className={errors.admissionDate ? 'border-red-500' : ''}
                />
                {errors.admissionDate && <p className="text-sm text-red-600 mt-1">{errors.admissionDate}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="feeStructure">Total Course Fee (₹) *</Label>
              <Input
                id="feeStructure"
                type="number"
                value={formData.feeStructure || ''}
                onChange={(e) => handleInputChange('feeStructure', parseInt(e.target.value) || 0)}
                className={errors.feeStructure ? 'border-red-500' : ''}
                placeholder="e.g., 500000"
              />
              {errors.feeStructure && <p className="text-sm text-red-600 mt-1">{errors.feeStructure}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount Required (₹) *</Label>
              <Input
                id="loanAmount"
                type="number"
                value={formData.loanAmount || ''}
                onChange={(e) => handleInputChange('loanAmount', parseInt(e.target.value) || 0)}
                className={errors.loanAmount ? 'border-red-500' : ''}
                placeholder="e.g., 500000"
              />
              {errors.loanAmount && <p className="text-sm text-red-600 mt-1">{errors.loanAmount}</p>}
              <p className="text-sm text-slate-500 mt-1">
                Minimum: ₹50,000 | Maximum: ₹50,00,000
              </p>
            </div>
            <div>
              <Label htmlFor="purpose">Purpose of Loan *</Label>
              <Textarea
                id="purpose"
                value={formData.purpose || ''}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className={errors.purpose ? 'border-red-500' : ''}
                rows={3}
                placeholder="Describe how you plan to use the loan amount..."
              />
              {errors.purpose && <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="annualIncome">Annual Income (₹) *</Label>
              <Input
                id="annualIncome"
                type="number"
                value={formData.annualIncome || ''}
                onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value) || 0)}
                className={errors.annualIncome ? 'border-red-500' : ''}
                placeholder="e.g., 600000"
              />
              {errors.annualIncome && <p className="text-sm text-red-600 mt-1">{errors.annualIncome}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select onValueChange={(value) => handleInputChange('employmentType', value)}>
                  <SelectTrigger className={errors.employmentType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && <p className="text-sm text-red-600 mt-1">{errors.employmentType}</p>}
              </div>
              <div>
                <Label htmlFor="employerName">Employer/Company Name *</Label>
                <Input
                  id="employerName"
                  value={formData.employerName || ''}
                  onChange={(e) => handleInputChange('employerName', e.target.value)}
                  className={errors.employerName ? 'border-red-500' : ''}
                />
                {errors.employerName && <p className="text-sm text-red-600 mt-1">{errors.employerName}</p>}
              </div>
            </div>

            {/* Co-applicant Section */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="hasCoApplicant"
                  checked={formData.hasCoApplicant}
                  onCheckedChange={(checked) => handleInputChange('hasCoApplicant', checked)}
                />
                <Label htmlFor="hasCoApplicant">Add Co-applicant (Optional)</Label>
              </div>

              {formData.hasCoApplicant && (
                <div className="space-y-4 pl-6 border-l-2 border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="coApplicantName">Co-applicant Name</Label>
                      <Input
                        id="coApplicantName"
                        value={formData.coApplicantName || ''}
                        onChange={(e) => handleInputChange('coApplicantName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="coApplicantRelation">Relationship</Label>
                      <Select onValueChange={(value) => handleInputChange('coApplicantRelation', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="coApplicantIncome">Co-applicant Annual Income (₹)</Label>
                    <Input
                      id="coApplicantIncome"
                      type="number"
                      value={formData.coApplicantIncome || ''}
                      onChange={(e) => handleInputChange('coApplicantIncome', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Application Summary */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-3">Application Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Applicant:</span>
                  <span className="ml-2 font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-600">Institution:</span>
                  <span className="ml-2 font-medium">{formData.institution}</span>
                </div>
                <div>
                  <span className="text-slate-600">Course:</span>
                  <span className="ml-2 font-medium">{formData.course}</span>
                </div>
                <div>
                  <span className="text-slate-600">Loan Amount:</span>
                  <span className="ml-2 font-medium">₹{formData.loanAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                  understand that providing false information may result in rejection of my application.
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToDataProcessing"
                  checked={formData.agreeToDataProcessing}
                  onCheckedChange={(checked) => handleInputChange('agreeToDataProcessing', checked)}
                />
                <Label htmlFor="agreeToDataProcessing" className="text-sm leading-relaxed">
                  I consent to the processing of my personal data for loan application purposes and 
                  agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </Label>
              </div>
              {errors.agreeToDataProcessing && <p className="text-sm text-red-600">{errors.agreeToDataProcessing}</p>}
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Your application will be reviewed within 3-5 business days</li>
                    <li>You will be assigned a DSA who will guide you through the process</li>
                    <li>Additional documents may be requested during review</li>
                    <li>Loan approval is subject to bank&apos;s terms and conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Education Loan Application</h1>
            <p className="text-slate-600">Complete all steps to submit your application</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">
                Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
              </span>
              <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className="bg-white border border-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle>{stepTitles[currentStep - 1]}</CardTitle>
            <CardDescription>
              {currentStep === 6 
                ? 'Review your information and submit your application'
                : 'Please fill in all required fields marked with *'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
