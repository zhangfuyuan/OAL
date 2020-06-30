import component from './th-TH/component';
import globalHeader from './th-TH/globalHeader';
import menu from './th-TH/menu';
import pwa from './th-TH/pwa';
import settingDrawer from './th-TH/settingDrawer';
import settings from './th-TH/settings';
import oal from './th-TH/oal';

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
