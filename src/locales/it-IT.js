import component from './it-IT/component';
import globalHeader from './it-IT/globalHeader';
import menu from './it-IT/menu';
import pwa from './it-IT/pwa';
import settingDrawer from './it-IT/settingDrawer';
import settings from './it-IT/settings';
import oal from './it-IT/oal';

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
