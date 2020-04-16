import component from './zh-TW/component';
import globalHeader from './zh-TW/globalHeader';
import menu from './zh-TW/menu';
import pwa from './zh-TW/pwa';
import settingDrawer from './zh-TW/settingDrawer';
import settings from './zh-TW/settings';
import oal from './zh-TW/oal';

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.preview.down.block': '下載此頁面到本地項目',
  'app.welcome.link.fetch-blocks': '獲取全部區塊',
  'app.welcome.link.block-list': '基於 block 開發，快速構建標準頁面',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...oal,
};
