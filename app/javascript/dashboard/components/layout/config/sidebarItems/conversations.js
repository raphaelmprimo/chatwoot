import { frontendURL } from '../../../../helper/URLHelper';

const conversations = accountId => ({
  parentNav: 'conversations',
  routes: [
    'home',
    'inbox_dashboard',
    'inbox_conversation',
    'conversation_through_inbox',
    'notifications_dashboard',
    'label_conversations',
    'conversations_through_label',
    'team_conversations',
    'conversations_through_team',
    'conversation_mentions',
    'conversation_through_mentions',
    'conversation_participating',
    'conversation_through_participating',
    'folder_conversations',
    'conversations_through_folders',
    'conversation_unattended',
    'conversation_through_unattended',
    'conversations_status',
    'conversations_status_ej2',
    'conversations_flows'
  ],
  menuItems: [
    {
      icon: 'chat',
      label: 'ALL_CONVERSATIONS',
      key: 'conversations',
      toState: frontendURL(`accounts/${accountId}/dashboard`),
      toolTip: 'Conversation from all subscribed inboxes',
      toStateName: 'home',
    },
    {
      icon: 'mention',
      label: 'MENTIONED_CONVERSATIONS',
      key: 'conversation_mentions',
      toState: frontendURL(`accounts/${accountId}/mentions/conversations`),
      toStateName: 'conversation_mentions',
    },
    {
      icon: 'mail-unread',
      label: 'UNATTENDED_CONVERSATIONS',
      key: 'conversation_unattended',
      toState: frontendURL(`accounts/${accountId}/unattended/conversations`),
      toStateName: 'conversation_unattended',
    },
    {
      icon: 'arrow-trending-lines',
      label: 'STATUS_CONVERSATIONS',
      key: 'conversations_status',
      toState: frontendURL(`accounts/${accountId}/status/conversations`),
      toStateName: 'conversations_status',
    },
    {
      icon: 'arrow-trending-lines',
      label: 'SCHEDULE',
      key: 'schedule',
      toState: frontendURL(`accounts/${accountId}/schedule`),
      toStateName: 'schedule',
    },
    {
      icon: 'arrow-trending-lines',
      label: 'FLOW_DEVBOT',
      key: 'conversations_flows',
      toState: frontendURL(`accounts/${accountId}/flows/conversations`),
      toStateName: 'conversations_flows',
    },
/*     {
      icon: 'arrow-trending-lines',
      label: 'STATUS_CONVERSATIONS_EJ2',
      key: 'conversations_status_ej2',
      toState: frontendURL(`accounts/${accountId}/status/ej2/conversations`),
      toStateName: 'conversations_status_ej2',
    }, */
  ],
});

export default conversations;
