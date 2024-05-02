import {
  createHashRouter,
  RouteWithoutRoot,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'home',
  PERSIK: 'persik',
} as const;

const routes: RouteWithoutRoot[] = [
  {
    path: '/', 
    panel: 'home',
    view: DEFAULT_VIEW,
  },
  {
    path: '/newsDetails/:id', 
    panel: 'newsDetails',
    view: DEFAULT_VIEW,
  },
]

export const router = createHashRouter(routes);
