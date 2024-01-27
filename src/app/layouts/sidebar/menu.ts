import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 8,
        isLayout: true
    },
    {
        id: 10,
        label: 'Charts',
        icon: 'bx-bar-chart',
        link: '/charts',
    },
    {
        id: 20,
        label: 'Videos',
        icon: 'bx-bar-chart',
        link: '/videos',
    }
    ,
    {
        id: 30,
        label: 'Chat',
        icon: 'bx-bar-chart',
        link: '/chat',
        // embeded chat discord
    },
    {
        id: 40,
        label: 'Options Flow / GEX',
        icon: 'bx-bar-chart',
        link: '/options',
        // batnami built this need to remap data to a new layout 2 sections so have dropdown
    },
    {
        id: 50,
        label: 'Dark Pool',
        icon: 'bx-bar-chart',
        link: '/dark-pool',
        // block trade scanners, blocks, data in table format
    },
    {
        id: 60,
        label: 'Scanner',
        icon: 'bx-bar-chart',
        link: '/scanner',
        // divergence alpha flow scanners
    },
    {
        id: 70,
        label: 'Social',
        icon: 'bx-bar-chart',
        link: '/social',
        // posting charts gammification
    },
    {
        id: 80,
        label: 'Crypto',
        icon: 'bx-bar-chart',
        link: '/crypto',
        // add this link but have it coming soon
    }
    ,
    {
        id: 90,
        label: 'FT Classic',
        icon: 'bx-bar-chart',
        link: '/ft-classic',
        // add this link but have it coming soon
    }
];

