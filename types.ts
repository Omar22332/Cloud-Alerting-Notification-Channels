// FIX: Removed self-import of ChannelType and ChannelStatus.
// This was causing a circular dependency and declaration conflicts.
export enum ChannelType {
  EMAIL = 'Email',
  SLACK = 'Slack',
  PAGERDUTY = 'PagerDuty',
  WEBHOOK = 'Webhook',
  SMS = 'SMS',
}

export enum ChannelStatus {
    OK = 'OK',
    PENDING = 'Pending',
    ERROR = 'Error',
}

export interface NotificationChannel {
  id: string;
  displayName: string;
  type: ChannelType;
  enabled: boolean;
  status: ChannelStatus;
  labels: { key: string; value: string }[];
  mutedUntil?: string; // ISO string
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export interface FilterState {
  type: ChannelType | 'all';
  status: ChannelStatus | 'all';
  muted: boolean;
}