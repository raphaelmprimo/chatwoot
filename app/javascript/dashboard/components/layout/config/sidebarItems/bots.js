import { frontendURL } from '../../../../helper/URLHelper';

const bots = accountId => ({
  parentNav: 'bots',
  routes: ['devbots', 'flows'],
  menuItems: [
    {
      icon: 'bot',
      label: 'DEVBOTS',
      key: 'devbots',
      toState: frontendURL(`bots/${accountId}/devbots`),
      toStateName: 'devbots',
    },
    {
      icon: 'arrow-trending-lines',
      label: 'FLOW_DEVBOT',
      key: 'flows',
      toState: frontendURL(`bots/${accountId}/flow`),
      toStateName: 'flows',
    },
  ],
});

export default bots;
