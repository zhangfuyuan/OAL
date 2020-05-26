import component from './ko-KR/component';
import globalHeader from './ko-KR/globalHeader';
import menu from './ko-KR/menu';
import pwa from './ko-KR/pwa';
import settingDrawer from './ko-KR/settingDrawer';
import settings from './ko-KR/settings';
import oal from './ko-KR/oal';

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
