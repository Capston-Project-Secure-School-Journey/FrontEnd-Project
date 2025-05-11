export interface NotificationEntity {
  id?: string;
  title?: string;
  content?: string;
  type?: number;
  recipientId?: string;
  senderId?: string;
  createdAt?: string;
  isRead?: boolean;
  navigation?: string;
  priority?: number;
  recipient?: string;
  sender?: string;
}
