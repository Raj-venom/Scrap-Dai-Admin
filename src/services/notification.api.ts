import API from "./api";

interface NotificationResponse {
  success: boolean;
  message?: string;
  stats?: {
    totalRecipients: number;
    successfulDeliveries: number;
    failedChunks: number;
    notificationsCreated: number;
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

interface PromotionalNotificationPayload {
  title: string;
  message: string;
  data?: Record<string, unknown>;
  userType: 'all' | 'users' | 'collectors';
}

interface SystemNotificationPayload {
  title: string;
  message: string;
}

class NotificationService {
  private baseUrl = "/notification";

  async sendPromotionalNotification(payload: PromotionalNotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await API.post(`${this.baseUrl}/promotional`, payload);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('API :: sendPromotionalNotification :: error', error.message);
        return { success: false, message: error.message };
      }
      console.log('API :: sendPromotionalNotification :: unexpected error', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

  async sendSystemNotification(payload: SystemNotificationPayload): Promise<NotificationResponse> {
    try {
      const response = await API.post(`${this.baseUrl}/system`, payload);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log('API :: sendSystemNotification :: error', error.message);
        return { success: false, message: error.message };
      }
      console.log('API :: sendSystemNotification :: unexpected error', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }

}

const notificationService = new NotificationService();
export default notificationService;