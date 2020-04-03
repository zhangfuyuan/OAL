export default {
  publicPath: process.env.NODE_ENV === 'production' ? '/OAL/' : '/',
  navTheme: 'dark',
  primaryColor: '#1890FF',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: true,
  autoHideHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Face ID',
  pwa: false,
  iconfontUrl: '',
};
