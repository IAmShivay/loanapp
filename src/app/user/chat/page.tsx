import { getAuthSession } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  User
} from 'lucide-react';

export default async function UserChatPage() {
  const session = await getAuthSession();
  
  if (!session?.user || session.user.role !== 'user') {
    redirect('/login');
  }

  // TODO: Replace with actual API calls
  const dsaInfo = {
    name: 'Jane Smith',
    designation: 'Senior DSA',
    bank: 'SBI',
    dsaId: 'SBI238001EMB',
    phone: '+91 9876543210',
    email: 'jane.smith@sbi.co.in',
    status: 'online',
    avatar: null,
    specialization: ['Education Loans', 'Personal Loans']
  };

  const messages = [
    {
      id: '1',
      senderId: 'dsa',
      senderName: 'Jane Smith',
      message: 'Hello! I\'m Jane Smith, your assigned DSA from SBI. I\'m here to help you with your education loan application.',
      timestamp: '2024-12-10T10:00:00Z',
      isOwn: false
    },
    {
      id: '2',
      senderId: session.user.id,
      senderName: session.user.name,
      message: 'Hi Jane! Thank you for reaching out. I have some questions about my application.',
      timestamp: '2024-12-10T10:05:00Z',
      isOwn: true
    },
    {
      id: '3',
      senderId: 'dsa',
      senderName: 'Jane Smith',
      message: 'Of course! I\'m here to help. What would you like to know about your application?',
      timestamp: '2024-12-10T10:07:00Z',
      isOwn: false
    },
    {
      id: '4',
      senderId: session.user.id,
      senderName: session.user.name,
      message: 'I noticed that my application status shows "document pending". Which documents are still required?',
      timestamp: '2024-12-10T10:10:00Z',
      isOwn: true
    },
    {
      id: '5',
      senderId: 'dsa',
      senderName: 'Jane Smith',
      message: 'Let me check your application details. You need to upload your bank statements for the last 6 months and salary slips for the last 3 months. These are required for income verification.',
      timestamp: '2024-12-10T10:15:00Z',
      isOwn: false
    },
    {
      id: '6',
      senderId: session.user.id,
      senderName: session.user.name,
      message: 'I have the bank statements ready. Where should I upload them?',
      timestamp: '2024-12-10T10:20:00Z',
      isOwn: true
    },
    {
      id: '7',
      senderId: 'dsa',
      senderName: 'Jane Smith',
      message: 'You can upload them directly in your application dashboard. Go to "My Applications" → Select your application → "Upload Documents" section. Make sure the files are in PDF format and under 5MB each.',
      timestamp: '2024-12-10T10:25:00Z',
      isOwn: false
    },
    {
      id: '8',
      senderId: session.user.id,
      senderName: session.user.name,
      message: 'Perfect! I\'ll upload them right away. How long does the review process usually take?',
      timestamp: '2024-12-10T10:30:00Z',
      isOwn: true
    },
    {
      id: '9',
      senderId: 'dsa',
      senderName: 'Jane Smith',
      message: 'Once you upload the documents, I\'ll review them within 24 hours. If everything looks good, your application will move to the final approval stage, which typically takes 2-3 business days.',
      timestamp: '2024-12-10T10:35:00Z',
      isOwn: false
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat with DSA</h1>
          <p className="text-slate-600">Get instant help from your assigned loan advisor</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* DSA Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Your DSA</CardTitle>
                <CardDescription>Assigned loan advisor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="relative inline-block mb-3">
                    <Avatar className="h-16 w-16 mx-auto">
                      <AvatarImage src={dsaInfo.avatar || undefined} />
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        {getInitials(dsaInfo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(dsaInfo.status)}`}></div>
                  </div>
                  <h3 className="font-semibold text-slate-900">{dsaInfo.name}</h3>
                  <p className="text-sm text-slate-600">{dsaInfo.designation}</p>
                  <Badge className="bg-blue-100 text-blue-800 mt-2">
                    {dsaInfo.bank} - {dsaInfo.dsaId}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{dsaInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-900">{dsaInfo.email}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Specialization</h4>
                  <div className="flex flex-wrap gap-1">
                    {dsaInfo.specialization.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-white border border-slate-200 h-[600px] flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={dsaInfo.avatar || undefined} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getInitials(dsaInfo.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(dsaInfo.status)}`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{dsaInfo.name}</h3>
                      <p className="text-sm text-slate-500 capitalize">{dsaInfo.status}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex items-center justify-center my-4">
                            <div className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        )}
                        <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                            {!message.isOwn && (
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                                    {getInitials(message.senderName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-slate-500">{message.senderName}</span>
                              </div>
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                message.isOwn
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-900'
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                              {message.isOwn && (
                                <CheckCheck className="h-3 w-3 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      className="pr-10"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>DSA typically responds within 30 minutes</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
