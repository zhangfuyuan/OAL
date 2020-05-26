import component from './de-DE/component';
import globalHeader from './de-DE/globalHeader';
import menu from './de-DE/menu';
import pwa from './de-DE/pwa';
import settingDrawer from './de-DE/settingDrawer';
import settings from './de-DE/settings';
import oal from './de-DE/oal';

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
