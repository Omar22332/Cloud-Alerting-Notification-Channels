import { NotificationChannel, ChannelType, ChannelStatus } from './types';

const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();

export const MOCK_CHANNELS: NotificationChannel[] = [
  {
    id: '1',
    displayName: 'Production Alerts',
    type: ChannelType.PAGERDUTY,
    enabled: true,
    status: ChannelStatus.OK,
    labels: [{ key: 'team', value: 'sre' }, { key: 'severity', value: 'critical' }],
  },
  {
    id: '2',
    displayName: 'Dev Team On-Call',
    type: ChannelType.SLACK,
    enabled: true,
    status: ChannelStatus.OK,
    labels: [{ key: 'team', value: 'backend' }],
  },
  {
    id: '3',
    displayName: 'Customer Support Email',
    type: ChannelType.EMAIL,
    enabled: true,
    status: ChannelStatus.OK,
    labels: [{ key: 'team', value: 'support' }],
  },
  {
    id: '4',
    displayName: 'Billing Webhook',
    type: ChannelType.WEBHOOK,
    enabled: false,
    status: ChannelStatus.OK,
    labels: [{ key: 'service', value: 'billing' }],
  },
  {
    id: '5',
    displayName: 'CEO SMS Alerts',
    type: ChannelType.SMS,
    enabled: true,
    status: ChannelStatus.PENDING,
    labels: [{ key: 'severity', value: 'critical' }, { key: 'escalation', value: 'level-3'}],
  },
  {
    id: '6',
    displayName: 'Marketing Email Group',
    type: ChannelType.EMAIL,
    enabled: true,
    status: ChannelStatus.OK,
    labels: [{ key: 'team', value: 'marketing' }],
    mutedUntil: oneHourFromNow,
  },
  {
    id: '7',
    displayName: 'Data Science Slack',
    type: ChannelType.SLACK,
    enabled: true,
    status: ChannelStatus.ERROR,
    labels: [{ key: 'team', value: 'data' }],
  },
];
