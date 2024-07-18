import conversations from './sidebarItems/conversations';
import contacts from './sidebarItems/contacts';
import reports from './sidebarItems/reports';
import campaigns from './sidebarItems/campaigns';
import settings from './sidebarItems/settings';
import notifications from './sidebarItems/notifications';
import primaryMenu from './sidebarItems/primaryMenu';
import bots from './sidebarItems/bots';
import evolution from './sidebarItems/evolution';

export const getSidebarItems = accountId => ({
  primaryMenu: primaryMenu(accountId),
  secondaryMenu: [
    conversations(accountId),
    contacts(accountId),
    bots(accountId),
    reports(accountId),
    campaigns(accountId),
    settings(accountId),
    notifications(accountId),
    evolution(accountId),
  ],
});
