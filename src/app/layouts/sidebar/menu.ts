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
        icon: 'bx bxl-youtube',
        link: '/videos',
    }
    ,
    {
        id: 30,
        label: 'Chat',
        icon: 'bx bx-chat',
        link: '/chat',
        // embeded chat discord
    },
    {
        id: 40,
        label: 'Options Flow / GEX',
        icon: 'bx bx-bar-chart-alt-2',
        link: '/options',
        // batnami built this need to remap data to a new layout 2 sections so have dropdown
    },
    {
        id: 50,
        label: 'Dark Pool',
        icon: 'bx bx-ghost',
        link: '/dark-pool',
        // block trade scanners, blocks, data in table format
    },
    {
        id: 60,
        label: 'Scanner',
        icon: 'bx bx-repeat',
        link: '/scanner',
        // divergence alpha flow scanners
    },
    {
        id: 70,
        label: 'FT Divergance',
        icon: 'bx bx-group',
        link: '/ft-divergance',
        // posting charts gammification
    },
    {
        id: 80,
        label: 'Crypto',
        icon: 'bx bxl-bitcoin',
        link: '/crypto',
        // add this link but have it coming soon
    }
    ,
    {
        id: 90,
        label: 'FT Classic',
        icon: 'bx bxs-barcode',
        link: '/classic',
        // add this link but have it coming soon
    }
];

