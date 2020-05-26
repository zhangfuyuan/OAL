import React from 'react';
import {
  _setIntlObject,
  addLocaleData,
  IntlProvider,
  intlShape,
  LangContext,
  _setLocaleContext
} from 'umi-plugin-locale/lib/locale';

const InjectedWrapper = (() => {
  let sfc = (props, context) => {
    _setIntlObject(context.intl);
    return props.children;
  };
  sfc.contextTypes = {
    intl: intlShape,
  };
  return sfc;
})();

import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/ko';
import 'moment/locale/pt-br';
import 'moment/locale/ru';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';

const baseNavigator = true;
const baseSeparator = '-';
const useLocalStorage = true;

import { LocaleProvider, version } from 'antd';
import moment from 'moment';
let defaultAntd = require('antd/lib/locale-provider/en_US');
defaultAntd = defaultAntd.default || defaultAntd;

const localeInfo = {
  'de-DE': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/de-DE.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/de-DE.js')),
    },
    locale: 'de-DE',
    antd: require('antd/lib/locale-provider/de_DE'),
    data: require('react-intl/locale-data/de'),
    momentLocale: 'de',
  },
  'en-US': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/en-US.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/en-US.js')),
    },
    locale: 'en-US',
    antd: require('antd/lib/locale-provider/en_US'),
    data: require('react-intl/locale-data/en'),
    momentLocale: '',
  },
  'es-ES': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/es-ES.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/es-ES.js')),
    },
    locale: 'es-ES',
    antd: require('antd/lib/locale-provider/es_ES'),
    data: require('react-intl/locale-data/es'),
    momentLocale: 'es',
  },
  'fr-FR': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/fr-FR.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/fr-FR.js')),
    },
    locale: 'fr-FR',
    antd: require('antd/lib/locale-provider/fr_FR'),
    data: require('react-intl/locale-data/fr'),
    momentLocale: 'fr',
  },
  'it-IT': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/it-IT.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/it-IT.js')),
    },
    locale: 'it-IT',
    antd: require('antd/lib/locale-provider/it_IT'),
    data: require('react-intl/locale-data/it'),
    momentLocale: 'it',
  },
  'ja-JP': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/ja-JP.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/ja-JP.js')),
    },
    locale: 'ja-JP',
    antd: require('antd/lib/locale-provider/ja_JP'),
    data: require('react-intl/locale-data/ja'),
    momentLocale: 'ja',
  },
  'ko-KR': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/ko-KR.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/ko-KR.js')),
    },
    locale: 'ko-KR',
    antd: require('antd/lib/locale-provider/ko_KR'),
    data: require('react-intl/locale-data/ko'),
    momentLocale: 'ko',
  },
  'pt-BR': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/pt-BR.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/pt-BR.js')),
    },
    locale: 'pt-BR',
    antd: require('antd/lib/locale-provider/pt_BR'),
    data: require('react-intl/locale-data/pt'),
    momentLocale: 'pt-br',
  },
  'ru-RU': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/ru-RU.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/ru-RU.js')),
    },
    locale: 'ru-RU',
    antd: require('antd/lib/locale-provider/ru_RU'),
    data: require('react-intl/locale-data/ru'),
    momentLocale: 'ru',
  },
  'zh-CN': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/zh-CN.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/zh-CN.js')),
    },
    locale: 'zh-CN',
    antd: require('antd/lib/locale-provider/zh_CN'),
    data: require('react-intl/locale-data/zh'),
    momentLocale: 'zh-cn',
  },
  'zh-TW': {
    messages: {
      ...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/locales/zh-TW.js')),...((locale) => locale.__esModule ? locale.default : locale)(require('E:/web/guarderClient/guarderClient/src/pages/user/login/locales/zh-TW.js')),
    },
    locale: 'zh-TW',
    antd: require('antd/lib/locale-provider/zh_TW'),
    data: require('react-intl/locale-data/zh'),
    momentLocale: 'zh-tw',
  },
};

class LocaleWrapper extends React.Component{
  state = {
    locale: 'en-US',
  };
  getAppLocale(){
    let appLocale = {
      locale: 'en-US',
      messages: {},
      data: require('react-intl/locale-data/en'),
      momentLocale: '',
    };

    const runtimeLocale = require('umi/_runtimePlugin').mergeConfig('locale') || {};
    const runtimeLocaleDefault =  typeof runtimeLocale.default === 'function' ? runtimeLocale.default() : runtimeLocale.default;
    if (
      useLocalStorage
      && typeof localStorage !== 'undefined'
      && localStorage.getItem('umi_locale')
      && localeInfo[localStorage.getItem('umi_locale')]
    ) {
      appLocale = localeInfo[localStorage.getItem('umi_locale')];
    } else if (
      typeof navigator !== 'undefined'
      && localeInfo[navigator.language]
      && baseNavigator
    ) {
      appLocale = localeInfo[navigator.language];
    } else if(localeInfo[runtimeLocaleDefault]){
      appLocale = localeInfo[runtimeLocaleDefault];
    } else {
      appLocale = localeInfo['en-US'] || appLocale;
    }
    window.g_lang = appLocale.locale;
    window.g_langSeparator = baseSeparator || '-';
    appLocale.data && addLocaleData(appLocale.data);

    // support dynamic add messages for umi ui
    // { 'zh-CN': { key: value }, 'en-US': { key: value } }
    const runtimeLocaleMessagesType = typeof runtimeLocale.messages;
    if (runtimeLocaleMessagesType === 'object' || runtimeLocaleMessagesType === 'function') {
      const runtimeMessage = runtimeLocaleMessagesType === 'object'
        ? runtimeLocale.messages[appLocale.locale]
        : runtimeLocale.messages()[appLocale.locale];
      Object.assign(appLocale.messages, runtimeMessage || {});
    }

    return appLocale;
  }
  reloadAppLocale = () => {
    const appLocale = this.getAppLocale();
    this.setState({
      locale: appLocale.locale,
    });
  };

  render(){
    const appLocale = this.getAppLocale();
    // react-intl must use `-` separator
    const reactIntlLocale = appLocale.locale.split(baseSeparator).join('-');
    const LangContextValue = {
      locale: reactIntlLocale,
      reloadAppLocale: this.reloadAppLocale,
    };
    let ret = this.props.children;
    ret = (<IntlProvider locale={reactIntlLocale} messages={appLocale.messages}>
      <InjectedWrapper>
        <LangContext.Provider value={LangContextValue}>
          <LangContext.Consumer>{(value) => {
            _setLocaleContext(value);
            return this.props.children
            }}</LangContext.Consumer>
        </LangContext.Provider>
      </InjectedWrapper>
    </IntlProvider>)
     // avoid antd ConfigProvider not found
     let AntdProvider = LocaleProvider;
     const [major, minor] = `${version || ''}`.split('.');
     // antd 3.21.0 use ConfigProvider not LocaleProvider
     const isConfigProvider = Number(major) > 3 || (Number(major) >= 3 && Number(minor) >= 21);
     if (isConfigProvider) {
       try {
         AntdProvider = require('antd/lib/config-provider').default;
       } catch (e) {}
     }

     return (<AntdProvider locale={appLocale.antd ? (appLocale.antd.default || appLocale.antd) : defaultAntd}>
      {ret}
    </AntdProvider>);
    return ret;
  }
}
export default LocaleWrapper;
