import { Icon, Menu } from 'antd';
import { formatMessage, getLocale, setLocale } from 'umi-plugin-react/locale';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = props => {
  const { className } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }) => setLocale(key, false);

  const locales = ['de-DE', 'en-US', 'es-ES', 'fr-FR', 'it-IT', 'ja-JP', 'ko-KR', 'ms-MY', 'pt-BR', 'ru-RU', 'th-TH', 'vi-VN', 'zh-CN', 'zh-TW'];
  const languageLabels = {
    'de-DE': 'Deutsche',
    'en-US': 'English',
    'es-ES': 'Español',
    'fr-FR': 'français',
    'it-IT': 'italiano',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
    'ms-MY': 'Melayu',
    'pt-BR': 'Português',
    'ru-RU': 'русский',
    'th-TH': 'ไทย',
    'vi-VN': 'Thổ nhĩ kỳ',
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <Icon
          type="global"
          title={formatMessage({
            id: 'navBar.lang',
          })}
        />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
