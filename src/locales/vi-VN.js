import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import menu from './vi-VN/menu';
import pwa from './vi-VN/pwa';
import settingDrawer from './vi-VN/settingDrawer';
import settings from './vi-VN/settings';
import oal from './vi-VN/oal';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...oal,
};
