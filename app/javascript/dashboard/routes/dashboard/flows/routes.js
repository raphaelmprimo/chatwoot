const FlowView = () => import('./FlowView.vue');
const DevbotView = () => import('./DevbotView.vue');
import { frontendURL } from '../../../helper/URLHelper';

export const routes = [
  {
    path: frontendURL('bots/:accountId/devbots'),
    name: 'devbots',
    roles: ['administrator', 'agent'],
    component: DevbotView,
  },
  {
    path: frontendURL('bots/:accountId/flow'),
    name: 'flows',
    roles: ['administrator', 'agent'],
    component: FlowView,
  },
];
