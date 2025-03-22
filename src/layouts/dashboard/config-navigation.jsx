import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(() => [
    // OVERVIEW
    // ----------------------------------------------------------------------
    {
      subheader: 'overview',
      items: [
        {
          title: 'analytics',
          path: paths.dashboard.root,
          icon: ICONS.analytics,
        },
        // {
        //   title: 'ecommerce',
        //   path: paths.dashboard.general.ecommerce,
        //   icon: ICONS.ecommerce,
        // },
      ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'management',
      items: [
        // USER
        {
          title: 'user',
          path: paths.dashboard.user.root,
          icon: ICONS.user,
          children: [
            { title: 'list', path: paths.dashboard.user.list },
            { title: 'create', path: paths.dashboard.user.new },
            { title: 'edit', path: paths.dashboard.user.demo.edit },
            // { title: 'account', path: paths.dashboard.user.account },
          ],
        },
        {
          title: 'category',
          path: paths.dashboard.category.root,
          icon: ICONS.user,
          children: [
            { title: 'list', path: paths.dashboard.category.list },
            { title: 'create', path: paths.dashboard.category.new },
            // { title: 'edit', path: paths.dashboard.category.demo.edit },
            // { title: 'account', path: paths.dashboard.user.account },
          ],
        },
        {
          title: 'discount',
          path: paths.dashboard.discount.root,
          icon: ICONS.user,
          children: [
            { title: 'list', path: paths.dashboard.discount.list },
            { title: 'create', path: paths.dashboard.discount.new },
            // { title: 'edit', path: paths.dashboard.category.demo.edit },
            // { title: 'account', path: paths.dashboard.user.account },
          ],
        },
        {
          title: 'banner',
          path: paths.dashboard.banner.root,
          icon: ICONS.user,
          children: [
            { title: 'list', path: paths.dashboard.banner.list },
            { title: 'create', path: paths.dashboard.banner.new },
            // { title: 'edit', path: paths.dashboard.category.demo.edit },
            // { title: 'account', path: paths.dashboard.user.account },
          ],
        },
        // PRODUCT
        {
          title: 'product',
          path: paths.dashboard.product.root,
          icon: ICONS.product,
          children: [
            { title: 'list', path: paths.dashboard.product.root },
            // {
            //   title: 'details',
            //   path: paths.dashboard.product.demo.details,
            // },
            { title: 'create', path: paths.dashboard.product.new },
            // { title: 'edit', path: paths.dashboard.product.demo.edit },
          ],
        },

        // ORDER
        {
          title: 'order',
          path: paths.dashboard.order.root,
          icon: ICONS.order,
          children: [
            { title: 'list', path: paths.dashboard.order.root },
            { title: 'details', path: paths.dashboard.order.demo.details },
          ],
        },

        // INVOICE
        {
          title: 'invoice',
          path: paths.dashboard.invoice.root,
          icon: ICONS.invoice,
          children: [
            { title: 'list', path: paths.dashboard.invoice.root },
            {
              title: 'details',
              path: paths.dashboard.invoice.demo.details,
            },
            { title: 'create', path: paths.dashboard.invoice.new },
            { title: 'edit', path: paths.dashboard.invoice.demo.edit },
          ],
        },

        // // MAIL
        // {
        //   title: 'mail',
        //   path: paths.dashboard.mail,
        //   icon: ICONS.mail,
        //   info: <Label color="error">+32</Label>,
        // },

        // // CHAT
        // {
        //   title: 'chat',
        //   path: paths.dashboard.chat,
        //   icon: ICONS.chat,
        // },

        // CALENDAR
        // {
        //   title: 'calendar',
        //   path: paths.dashboard.calendar,
        //   icon: ICONS.calendar,
        // },
      ],
    },
  ]);

  return data;
}
