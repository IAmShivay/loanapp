'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  ExternalLink
} from 'lucide-react';
import {
  useGetSupportTicketsQuery,
  useCreateSupportTicketMutation,
  useAddSupportTicketMessageMutation
} from '@/store/api/apiSlice';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { safeString, safeDate, safeTimeAgo } from '@/lib/utils/fallbacks';
import { toast } from 'sonner';

export default function UserSupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session?.user || session.user.role !== 'user') {
    router.push('/login');
    return null;
  }

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });

  // RTK Query hooks
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    error: ticketsError,
    refetch: refetchTickets
  } = useGetSupportTicketsQuery({
    status: statusFilter && statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter && categoryFilter !== 'all' ? categoryFilter : undefined,
    limit: 20,
    page: 1
  });

  const [createTicket, { isLoading: createLoading }] = useCreateSupportTicketMutation();
  const [addMessage] = useAddSupportTicketMessageMutation();

  const supportTickets = ticketsData?.tickets || [];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTicket(newTicket).unwrap();
      toast.success('Support ticket created successfully');
      setShowCreateForm(false);
      setNewTicket({
        subject: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });
      refetchTickets();
    } catch (error) {
      toast.error('Failed to create support ticket');
      console.error('Error creating ticket:', error);
    }
  };

  const faqItems = [
    {
      question: 'How long does the loan approval process take?',
      answer: 'The typical education loan approval process takes 7-15 business days from the time all required documents are submitted. This includes initial review (2-3 days), verification (3-5 days), and final approval (2-7 days).'
    },
    {
      question: 'What documents are required for education loan application?',
      answer: 'Required documents include: Admission letter, Fee structure, Academic transcripts, Income proof (salary slips/ITR), Bank statements (6 months), Identity proof (Aadhar/PAN), Address proof, and Collateral documents (if applicable).'
    },
    {
      question: 'Can I prepay my education loan without penalty?',
      answer: 'Yes, most education loans allow prepayment without penalty after a certain period (usually 6-12 months). Prepayment can significantly reduce your total interest burden. Check your loan agreement for specific terms.'
    },
    {
      question: 'What is the maximum loan amount I can get?',
      answer: 'For studies in India: Up to ₹10 lakhs without collateral, higher amounts with collateral. For studies abroad: Up to ₹20 lakhs without collateral, higher amounts with collateral. The exact amount depends on the course, institution, and your financial profile.'
    },
    {
      question: 'Are there any tax benefits on education loans?',
      answer: 'Yes, under Section 80E of the Income Tax Act, you can claim deduction on the entire interest paid on education loans. There is no upper limit on the deduction amount, and it can be claimed for up to 8 years.'
    },
    {
      question: 'Can I change my repayment schedule?',
      answer: 'Yes, most banks offer flexible repayment options including step-up EMIs, moratorium period during studies, and restructuring options. Contact your DSA or bank to discuss available options based on your financial situation.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
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

  if (ticketsLoading) {
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Center</h1>
          <p className="text-slate-600">Get help with your education loan application and account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Get immediate help</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with DSA
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Forms
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">Phone Support</div>
                      <div className="text-slate-600">1800-123-4567</div>
                      <div className="text-xs text-slate-500">Mon-Fri, 9 AM - 6 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">Email Support</div>
                      <div className="text-slate-600">support@loanportal.com</div>
                      <div className="text-xs text-slate-500">Response within 24 hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">Live Chat</div>
                      <div className="text-slate-600">Available 24/7</div>
                      <div className="text-xs text-slate-500">Average response: 5 minutes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create New Ticket */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Create Support Ticket
                </CardTitle>
                <CardDescription>
                  Can&apos;t find what you&apos;re looking for? Create a support ticket and we&apos;ll help you out.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="billing">Billing & Payment</SelectItem>
                          <SelectItem value="process">Process Related</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value: any) => setNewTicket(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please provide detailed information about your issue..."
                      rows={4}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={createLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {createLoading ? 'Creating...' : 'Create Ticket'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Tickets */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  My Support Tickets
                </CardTitle>
                <CardDescription>Track your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="process">Process</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {supportTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No support tickets found</p>
                    <p className="text-sm text-slate-400">Create your first ticket above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportTickets.map((ticket) => (
                      <div key={ticket._id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{safeString(ticket.subject)}</h3>
                              <Badge className={getStatusColor(ticket.status)} >
                                {ticket.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(ticket.priority)} >
                                {ticket.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{safeString(ticket.description)}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>#{safeString(ticket.ticketNumber)}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Created {safeDate(ticket.createdAt)}
                              </span>
                              <span>Updated {safeTimeAgo(ticket.updatedAt)}</span>
                              {ticket.messages && ticket.messages.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {ticket.messages.length} messages
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search FAQs..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium text-slate-900">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Helpful Resources
                </CardTitle>
                <CardDescription>Guides and documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Application Guide</h4>
                    <p className="text-sm text-slate-600 mb-3">Step-by-step guide to applying for education loans</p>
                    <Button variant="outline" >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Guide
                    </Button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Document Checklist</h4>
                    <p className="text-sm text-slate-600 mb-3">Complete list of required documents</p>
                    <Button variant="outline" >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">EMI Calculator</h4>
                    <p className="text-sm text-slate-600 mb-3">Calculate your monthly payments</p>
                    <Button variant="outline" >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Use Calculator
                    </Button>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Tax Benefits</h4>
                    <p className="text-sm text-slate-600 mb-3">Learn about education loan tax benefits</p>
                    <Button variant="outline" >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
