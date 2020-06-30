import component from './ms-MY/component';
import globalHeader from './ms-MY/globalHeader';
import menu from './ms-MY/menu';
import pwa from './ms-MY/pwa';
import settingDrawer from './ms-MY/settingDrawer';
import settings from './ms-MY/settings';
import oal from './ms-MY/oal';

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
