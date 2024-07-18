const InstancesView = () => import('./InstancesView.vue');
import { frontendURL } from '../../../helper/URLHelper';

export const routes = [
  {
    path: frontendURL('evolution/:accountId/instances'),
    name: 'instances',
    roles: ['administrator', 'agent'],
    component: InstancesView,
  },
];
