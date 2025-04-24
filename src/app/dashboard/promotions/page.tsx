// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Send, Bell, Megaphone, Check, X, Info } from "lucide-react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "react-hot-toast";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import notificationService from "@/services/notification.api";

// type UserType = 'all' | 'users' | 'collectors';
// type NotificationType = 'promotional' | 'system';

// interface Notification {
//   id: string;
//   title: string;
//   message: string;
//   type: NotificationType;
//   recipients: number;
//   status: 'sent' | 'failed' | 'pending';
//   stats?: {
//     totalRecipients: number;
//     successfulDeliveries: number;
//     failedChunks: number;
//     notificationsCreated: number;
//   };
//   tickets?: Array<{
//     status: string;
//     id: string;
//   }>;
//   preview?: {
//     title: string;
//     body: string;
//     data?: Record<string, unknown>;
//   };
// }

// export default function NotificationsPage() {
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState<NotificationType>('promotional');
//   const [userType, setUserType] = useState<UserType>('all');
//   const [deliveryResults, setDeliveryResults] = useState<any>(null);

//   // Form states
//   const [promotionalForm, setPromotionalForm] = useState({
//     title: "",
//     message: "",
//     data: "",
//   });

//   const [systemForm, setSystemForm] = useState({
//     title: "",
//     message: "",
//     urgency: "normal" as "low" | "normal" | "high",
//   });


//   const handlePromotionalSubmit = async () => {
//     if (!promotionalForm.title.trim() || !promotionalForm.message.trim()) {
//       toast.error("Title and message are required");
//       return;
//     }

//     setLoading(true);
//     setDeliveryResults(null);
//     try {
//       const payload = {
//         title: promotionalForm.title,
//         message: promotionalForm.message,
//         data: promotionalForm.data ? JSON.parse(promotionalForm.data) : {},
//         userType,
//       };

//       const response = await notificationService.sendPromotionalNotification(payload);

//       if (response.success) {
//         toast.success(`Notification sent successfully`);

//         const newNotification: Notification = {
//           id: response.tickets?.[0]?.id || Date.now().toString(),
//           title: promotionalForm.title,
//           message: promotionalForm.message,
//           type: 'promotional',
//           recipients: response.stats?.totalRecipients || 0,
//           status: 'sent',
//           stats: response.stats,
//           tickets: response.tickets,
//           preview: response.notificationPreview
//         };

//         setDeliveryResults(response);

//         // Reset form
//         setPromotionalForm({
//           title: "",
//           message: "",
//           data: "",
//         });
//       } else {
//         toast.error(response.message || "Failed to send notification");
//       }
//     } catch (error: any) {
//       console.error("Notification error:", error);
//       toast.error(error.message || "An error occurred while sending notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSystemSubmit = async () => {
//     if (!systemForm.title.trim() || !systemForm.message.trim()) {
//       toast.error("Title and message are required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await notificationService.sendSystemNotification({
//         title: systemForm.title,
//         message: systemForm.message,
//         urgency: systemForm.urgency
//       });

//       if (response.success) {
//         toast.success(`System notification sent to all users`);
//         // Reset form
//         setSystemForm({
//           title: "",
//           message: "",
//           urgency: "normal"
//         });
//       } else {
//         toast.error(response.message || "Failed to send notification");
//       }
//     } catch (error: any) {
//       console.error("System notification error:", error);
//       toast.error(error.message || "An error occurred while sending notification");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Notifications</h1>
//       </div>

//       <Tabs
//         value={activeTab}
//         onValueChange={(value) => setActiveTab(value as NotificationType)}
//         className="space-y-6"
//       >
//         <TabsList>
//           <TabsTrigger value="promotional">
//             <Megaphone className="h-4 w-4 mr-2" />
//             Promotional
//           </TabsTrigger>
//           <TabsTrigger value="system">
//             <Bell className="h-4 w-4 mr-2" />
//             System
//           </TabsTrigger>
//         </TabsList>

//         {/* Promotional Tab */}
//         <TabsContent value="promotional" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Megaphone className="h-5 w-5 mr-2" />
//                 Create Promotional Campaign
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Campaign Title *</Label>
//                   <Input
//                     id="title"
//                     name="title"
//                     placeholder="e.g. Summer Recycling Special!"
//                     value={promotionalForm.title}
//                     onChange={(e) => setPromotionalForm({ ...promotionalForm, title: e.target.value })}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Target Audience</Label>
//                   <Select
//                     value={userType}
//                     onValueChange={(value) => setUserType(value as UserType)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select audience" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Users</SelectItem>
//                       <SelectItem value="users">Users Only</SelectItem>
//                       <SelectItem value="collectors">Collectors Only</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="message">Notification Message *</Label>
//                 <Textarea
//                   id="message"
//                   name="message"
//                   placeholder="e.g. Get 20% bonus points for all plastic items recycled this month!"
//                   rows={4}
//                   value={promotionalForm.message}
//                   onChange={(e) => setPromotionalForm({ ...promotionalForm, message: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="data">Additional Data (JSON)</Label>
//                 <Textarea
//                   id="data"
//                   name="data"
//                   placeholder='e.g. {"campaignId": "summer2023", "discount": "20%"}'
//                   rows={3}
//                   value={promotionalForm.data}
//                   onChange={(e) => setPromotionalForm({ ...promotionalForm, data: e.target.value })}
//                 />
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button onClick={handlePromotionalSubmit} disabled={loading}>
//                   {loading ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending...
//                     </span>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Send Notification
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Delivery Results */}
//           {deliveryResults && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Info className="h-5 w-5 mr-2 text-blue-500" />
//                   Delivery Results
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                   <div className="border rounded-lg p-4">
//                     <div className="flex items-center space-x-2">
//                       <Check className="h-4 w-4 text-green-500" />
//                       <span className="text-sm font-medium">Total Recipients</span>
//                     </div>
//                     <div className="text-2xl font-bold mt-2">
//                       {deliveryResults.stats?.totalRecipients || 0}
//                     </div>
//                   </div>

//                   <div className="border rounded-lg p-4">
//                     <div className="flex items-center space-x-2">
//                       <Check className="h-4 w-4 text-green-500" />
//                       <span className="text-sm font-medium">Successful</span>
//                     </div>
//                     <div className="text-2xl font-bold mt-2">
//                       {deliveryResults.stats?.successfulDeliveries || 0}
//                     </div>
//                   </div>

//                   <div className="border rounded-lg p-4">
//                     <div className="flex items-center space-x-2">
//                       <X className="h-4 w-4 text-red-500" />
//                       <span className="text-sm font-medium">Failed</span>
//                     </div>
//                     <div className="text-2xl font-bold mt-2">
//                       {deliveryResults.stats?.failedChunks || 0}
//                     </div>
//                   </div>

//                   <div className="border rounded-lg p-4">
//                     <div className="flex items-center space-x-2">
//                       <Check className="h-4 w-4 text-green-500" />
//                       <span className="text-sm font-medium">Notifications</span>
//                     </div>
//                     <div className="text-2xl font-bold mt-2">
//                       {deliveryResults.stats?.notificationsCreated || 0}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="font-medium mb-2">Notification Preview</h3>
//                     <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
//                       <div className="font-medium">{deliveryResults.notificationPreview?.title}</div>
//                       <div className="text-sm mt-1">{deliveryResults.notificationPreview?.body}</div>
//                       {deliveryResults.notificationPreview?.data && (
//                         <div className="mt-2">
//                           <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
//                             {JSON.stringify(deliveryResults.notificationPreview.data, null, 2)}
//                           </pre>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <h3 className="font-medium mb-2">Delivery Tickets</h3>
//                     <div className="space-y-2">
//                       {deliveryResults.tickets?.map((ticket: any) => (
//                         <div key={ticket.id} className="border rounded-lg p-3 flex justify-between items-center">
//                           <div className="flex items-center space-x-2">
//                             {ticket.status === 'ok' ? (
//                               <Check className="h-4 w-4 text-green-500" />
//                             ) : (
//                               <X className="h-4 w-4 text-red-500" />
//                             )}
//                             <span className="font-mono text-sm">{ticket.id}</span>
//                           </div>
//                           <Badge variant={ticket.status === 'ok' ? 'default' : 'destructive'}>
//                             {ticket.status}
//                           </Badge>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* System Tab */}
//         <TabsContent value="system" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Bell className="h-5 w-5 mr-2" />
//                 System Notification
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="systemTitle">Title *</Label>
//                 <Input
//                   id="systemTitle"
//                   name="title"
//                   placeholder="e.g. System Maintenance Announcement"
//                   value={systemForm.title}
//                   onChange={(e) => setSystemForm({ ...systemForm, title: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="systemMessage">Message *</Label>
//                 <Textarea
//                   id="systemMessage"
//                   name="message"
//                   placeholder="e.g. We'll be performing scheduled maintenance on..."
//                   rows={4}
//                   value={systemForm.message}
//                   onChange={(e) => setSystemForm({ ...systemForm, message: e.target.value })}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Urgency Level</Label>
//                 <Select
//                   value={systemForm.urgency}
//                   onValueChange={(value) => setSystemForm({
//                     ...systemForm,
//                     urgency: value as "low" | "normal" | "high"
//                   })}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select urgency" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="low">Low Priority</SelectItem>
//                     <SelectItem value="normal">Normal Priority</SelectItem>
//                     <SelectItem value="high">High Priority</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button onClick={handleSystemSubmit} disabled={loading}>
//                   {loading ? (
//                     <span className="flex items-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Sending...
//                     </span>
//                   ) : (
//                     <>
//                       <Send className="h-4 w-4 mr-2" />
//                       Broadcast to All Users
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//       </Tabs>
//     </div>
//   );
// }


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bell, Megaphone, Check, X, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import notificationService from "@/services/notification.api";

type UserType = 'all' | 'users' | 'collectors';
type NotificationType = 'promotional' | 'system';

interface NotificationResponse {
  success: boolean;
  message?: string;
  stats?: {
    totalRecipients: number;
    successfulDeliveries: number;
    failedChunks: number;
    notificationsCreated: number;
    userType?: UserType;
    usersCount?: number;
    collectorsCount?: number;
  };
  tickets?: Array<{
    status: string;
    id: string;
  }>;
  notificationPreview?: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  };
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationType>('promotional');
  const [userType, setUserType] = useState<UserType>('all');
  const [deliveryResults, setDeliveryResults] = useState<NotificationResponse | null>(null);

  // Form states
  const [promotionalForm, setPromotionalForm] = useState({
    title: "",
    message: "",
    data: "",
  });

  const [systemForm, setSystemForm] = useState({
    title: "",
    message: "",
  });

  const handlePromotionalSubmit = async () => {
    if (!promotionalForm.title.trim() || !promotionalForm.message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: promotionalForm.title,
        message: promotionalForm.message,
        data: promotionalForm.data ? JSON.parse(promotionalForm.data) : undefined,
        userType,
      };

      const response = await notificationService.sendPromotionalNotification(payload);
      setDeliveryResults(response);

      if (response.success) {
        toast.success(`Notification sent successfully to ${userType === 'all' ? 'all users' : userType}`);
        setPromotionalForm({
          title: "",
          message: "",
          data: "",
        });
      } else {
        toast.error(response.message || "Failed to send notification");
      }
    } catch (error: any) {
      console.error("Notification error:", error);
      toast.error(error.message || "An error occurred while sending notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSubmit = async () => {
    if (!systemForm.title.trim() || !systemForm.message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setLoading(true);
    try {
      const response = await notificationService.sendSystemNotification({
        title: systemForm.title,
        message: systemForm.message,
      });

      setDeliveryResults(response);

      if (response.success) {
        toast.success(`System notification sent successfully`);
        setSystemForm({
          title: "",
          message: "",
        });
      } else {
        toast.error(response.message || "Failed to send notification");
      }
    } catch (error: any) {
      console.error("System notification error:", error);
      toast.error(error.message || "An error occurred while sending notification");
    } finally {
      setLoading(false);
    }
  };

  const renderDeliveryResults = () => {
    if (!deliveryResults) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            Delivery Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Total Recipients</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {deliveryResults.stats?.totalRecipients || 0}
              </div>
              {deliveryResults.stats?.userType && (
                <div className="text-xs mt-1 text-muted-foreground">
                  Target: {deliveryResults.stats.userType}
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Successful</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {deliveryResults.stats?.successfulDeliveries || 0}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Failed</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {deliveryResults.stats?.failedChunks || 0}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Notifications</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {deliveryResults.stats?.notificationsCreated || 0}
              </div>
              {deliveryResults.stats && (
                <div className="text-xs mt-1 text-muted-foreground">
                  {deliveryResults.stats.usersCount} users, {deliveryResults.stats.collectorsCount} collectors
                </div>
              )}
            </div>
          </div>

          {deliveryResults.notificationPreview && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Notification Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="font-medium">{deliveryResults.notificationPreview.title}</div>
                  <div className="text-sm mt-1">{deliveryResults.notificationPreview.body}</div>
                  {deliveryResults.notificationPreview.data && (
                    <div className="mt-2">
                      <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">
                        {JSON.stringify(deliveryResults.notificationPreview.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {deliveryResults.tickets && deliveryResults.tickets.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Delivery Tickets</h3>
                  <div className="space-y-2">
                    {deliveryResults.tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-3 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {ticket.status === 'ok' ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-mono text-sm">{ticket.id}</span>
                        </div>
                        <Badge variant={ticket.status === 'ok' ? 'default' : 'destructive'}>
                          {ticket.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as NotificationType);
          setDeliveryResults(null);
        }}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="promotional">
            <Megaphone className="h-4 w-4 mr-2" />
            Promotional
          </TabsTrigger>
          <TabsTrigger value="system">
            <Bell className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Promotional Tab */}
        <TabsContent value="promotional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="h-5 w-5 mr-2" />
                Create Promotional Campaign
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Summer Recycling Special!"
                    value={promotionalForm.title}
                    onChange={(e) => setPromotionalForm({ ...promotionalForm, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select
                    value={userType}
                    onValueChange={(value) => setUserType(value as UserType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="users">Users Only</SelectItem>
                      <SelectItem value="collectors">Collectors Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Notification Message *</Label>
                <Textarea
                  id="message"
                  placeholder="e.g. Get 20% bonus points for all plastic items recycled this month!"
                  rows={4}
                  value={promotionalForm.message}
                  onChange={(e) => setPromotionalForm({ ...promotionalForm, message: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Additional Data (JSON)</Label>
                <Textarea
                  id="data"
                  placeholder='e.g. {"campaignId": "summer2023", "discount": "20%"}'
                  rows={3}
                  value={promotionalForm.data}
                  onChange={(e) => setPromotionalForm({ ...promotionalForm, data: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handlePromotionalSubmit} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {renderDeliveryResults()}
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                System Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemTitle">Title *</Label>
                <Input
                  id="systemTitle"
                  placeholder="e.g. System Maintenance Announcement"
                  value={systemForm.title}
                  onChange={(e) => setSystemForm({ ...systemForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemMessage">Message *</Label>
                <Textarea
                  id="systemMessage"
                  placeholder="e.g. We'll be performing scheduled maintenance on..."
                  rows={4}
                  value={systemForm.message}
                  onChange={(e) => setSystemForm({ ...systemForm, message: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSystemSubmit} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Broadcast to All Users
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {renderDeliveryResults()}
        </TabsContent>
      </Tabs>
    </div>
  );
}