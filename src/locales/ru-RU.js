import component from './ru-RU/component';
import globalHeader from './ru-RU/globalHeader';
import menu from './ru-RU/menu';
import pwa from './ru-RU/pwa';
import settingDrawer from './ru-RU/settingDrawer';
import settings from './ru-RU/settings';
import oal from './ru-RU/oal';

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
