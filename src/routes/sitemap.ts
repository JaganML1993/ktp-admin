// import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Dashboard',
    path: '/',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 'pricing',
    subheader: 'Location',
    path: '/location',
    icon: 'material-symbols:location-on',
    active: true,
  },
  {
    id: 'settings',
    subheader: 'Logout',
    path: '#!',
    icon: 'material-symbols:settings-rounded',
    active: true,
  },
  // {
  //   id: 'account-settings',
  //   subheader: 'John Carter',
  //   path: '#!',
  // },
];

export default sitemap;
