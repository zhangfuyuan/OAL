import { parse } from 'querystring';
import moment from 'moment';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export function validateMobile(value) {
  const mobileReg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
  return mobileReg.test(value);
}


export function validateNum(value) {
  const numReg = /^\+?[1-9][0-9]*$/;
  return numReg.test(value);
}

/**
 * @param {blob} blob 待下载的文件
 * @param {string} saveName 文件名称
 */
const openDownloadDialog = (blob, saveName) => {
  // for ie 10 and later
  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blob, saveName);
    } catch (e) {
      console.log(e);
    }
  } else {
    // chrome or firefox
    if (typeof blob === 'object' && blob instanceof Blob) {
      blob = URL.createObjectURL(blob); // 创建blob地址
    }
    const aLink = document.createElement('a');
    aLink.href = blob;
    aLink.download = saveName;
    aLink.click();
  }
};

/**
 * 保存CSV文件 专属于考勤报表的导出
 */
export function exportCSV(headers, data, fileName) {
  // console.log('headers=====>', headers);
  let csv = `${headers.map(v => v.title).join(',')}\n`;
  const newLines = data.map(d => {
    const valArr = [];
    const line = [...headers];
    line.map(l => {
      const { dataIndex, options } = l;
      const indexArr = dataIndex.split('_');
      if (indexArr.length === 1) {
        if (indexArr[0] === 'date') {
          // eslint-disable-next-line no-underscore-dangle
          valArr.push((d._id && d._id.deviceDate) ? moment(d._id && d._id.deviceDate).format('YYYY-MM-DD') : '-');
        } else if (indexArr[0] === 'beginTime') {
          valArr.push(d.min ? moment(d.min).format('HH:mm:ss') : '-');
        } else if (indexArr[0] === 'endTime') {
          valArr.push(d.max ? moment(d.max).format('HH:mm:ss') : '-');
        } else if (indexArr[0] === 'inCount') {
          const inArr = (d.accessTypes && d.accessTypes.filter(a => a === 1)) || [];
          valArr.push(inArr.length);
        } else if (indexArr[0] === 'outCount') {
          const inArr = (d.accessTypes && d.accessTypes.filter(a => a === 2)) || [];
          valArr.push(inArr.length);
        }
      } else if (indexArr.length === 2) {
        if (indexArr[0] === 'deviceInfo') {
          valArr.push((d.deviceInfo && d.deviceInfo.name) || '');
        } else if (indexArr[0] === 'faceInfo') {
          valArr.push((d.faceInfo && d.faceInfo.name) || '');
        }
      } else if (indexArr.length === 3) {
        if (options) {
          const value = (d.faceInfo && d.faceInfo.profile && d.faceInfo.profile[indexArr[2]]) || '';
          if (value !== undefined && value !== '' && value !== null) {
            const index = options.findIndex(item => item.value === value);
            if (index !== -1) {
              valArr.push(options[index].text);
            } else {
              valArr.push('');
            }
          } else {
            valArr.push('');
          }
        } else {
          valArr.push((d.faceInfo && d.faceInfo.profile && d.faceInfo.profile[indexArr[2]]) || '');
        }
      }
    });
    return valArr.join(',');
  });
  csv += newLines.join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv,charset=UTF-8' });
  openDownloadDialog(blob, fileName);
}

/**
 * js 数组 转为树形结构
 * 
 * [{ _id, pid }, { _id, pid }] => [{ _id, pid, children }]
 * 
 */
export function toTree(data) {
  let result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach(item => {
    delete item.children;
  });
  let map = {};
  data.forEach(item => {
    map[item._id] = item;
  });
  data.forEach(item => {
    let parent = map[item.pid];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * 加密
 */
export function pswBase64Thrice(value) {
  let res = '';

  try {
    res = window.btoa(window.btoa(window.btoa(value)));
  } catch (err) {
    console.log(err);
    res = value;
  }

  return res;
}

/**
 * 解密
 */
export function pswBase64ThriceRestore(value) {
  let res = '';

  try {
    res = window.atob(window.atob(window.atob(value)));
  } catch (err) {
    console.log(err);
    res = value;
  }

  return res;
}

/**
 * 温度单位，摄氏度转成华氏度
 * 
 * return 保留小数点后一位的字符串
 */
export function temperatureC2F(value) {
  let res = parseFloat(value) || 0;

  try {
    res = res * 9 / 5 + 32;
  } catch (err) {
    console.log(err);
  }

  return res.toFixed(1);
}

/**
 * 温度单位，华氏度转成摄氏度
 * 
 * return 保留小数点后一位的字符串
 */
export function temperatureF2C(value) {
  let res = parseFloat(value) || 0;

  try {
    res = (res - 32) * 5 / 9;
  } catch (err) {
    console.log(err);
  }

  return res.toFixed(1);
}

/**
 * 终端识别模式转化成字符串
 * value 识别模式的集合值
 * return 字符串
 */
export function parseRecognitionModeToStr(value) {
  if (value && value.indexOf) {
    const inFace = value.indexOf('face') > -1;
    const inMask = value.indexOf('mask') > -1;
    const inTemperature = value.indexOf('temperature') > -1;

    if (inFace && inMask && inTemperature) return '4';
    if (inFace && inMask) return '7';
    if (inFace && inTemperature) return '1';
    if (inMask && inTemperature) return '2';
    if (inFace) return '5';
    if (inMask) return '6';
    if (inTemperature) return '3';
  }

  return '';
}

/**
 * 终端识别模式转化成数组
 * value 识别模式的值
 * return 数组
 */
export function parseRecognitionModeToArr(value) {
  const modeMap = {
    '0': [],
    '1': ['face', 'temperature'],
    '2': ['mask', 'temperature'],
    '3': ['temperature'],
    '4': ['face', 'mask', 'temperature'],
    '5': ['face'],
    '6': ['mask'],
    '7': ['face', 'mask'],
  };

  return modeMap[value || '0'];
}

/**
 * 终端识别模式国际化
 * value  识别模式的值
 * $i18n  国际化方法
 * other  是否仅获取模式值集合
 * return 保留小数点后一位的字符串
 */
export function i18nRecognitionMode(value, $i18n, other) {
  const modeMap = {
    '1': ['oal.common.face', 'oal.common.temperature'],
    '2': ['oal.common.mask', 'oal.common.temperature'],
    '3': ['oal.common.temperature'],
    '4': ['oal.common.face', 'oal.common.mask', 'oal.common.temperature'],
    '5': ['oal.common.face'],
    '6': ['oal.common.mask'],
    '7': ['oal.common.face', 'oal.common.mask'],
  };

  if (other) return ['5', '6', '3', '1', '7', '2', '4'];
  if (!value || typeof $i18n !== 'function') return '';

  return modeMap[value] && modeMap[value].map(item => item && $i18n({ id: item }) || '').join('+') || '';
}
