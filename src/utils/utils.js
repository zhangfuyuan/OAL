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
          valArr.push((d._id && d._id.deviceDate) ? moment(d._id && d._id.deviceDate).format('YYYY-MM-DD') : '--');
        } else if (indexArr[0] === 'beginTime') {
          valArr.push(d.min ? moment(d.min).format('HH:mm:ss') : '--');
        } else if (indexArr[0] === 'endTime') {
          valArr.push(d.max ? moment(d.max).format('HH:mm:ss') : '--');
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
 * [{ id, pid }, { id, pid }] => [{ id, pid, children }]
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
    map[item.id] = item;
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
