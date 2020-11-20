import qs from 'querystring'
// 拼接url地址
export function joinUrl(url, params = '') {
  if (!params) {return url;}

  let tag = url.includes('?') ? '&' : '?';

  if (typeof params === 'object') {
    params = qs.stringify(params);
  }

  return url + tag + params;
}