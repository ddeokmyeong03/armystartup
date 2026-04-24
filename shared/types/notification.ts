export interface NotificationItem {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
