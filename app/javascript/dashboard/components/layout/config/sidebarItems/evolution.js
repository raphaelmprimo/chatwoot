import { frontendURL } from '../../../../helper/URLHelper';

const evolutions = accountId => ({
  parentNav: 'evolutions',
  routes: ['instances'],
  menuItems: [
    {
      icon: 'whatsapp',
      label: 'INSTANCES_FLOW',
      key: 'instances',
      toState: frontendURL(`evolution/${accountId}/instances`),
      toStateName: 'instances',
    },
  ],
});

export default evolutions;
