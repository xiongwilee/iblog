const url = require('url');
const querystring = require('querystring');

/**
 * 常用关键的配置
 * @type {Object}
 */
const config = {
  // username & repo name
  owner: 'xiongwilee',
  repo: 'blog',

  // OAuth applications clientId & clientSecret
  client_id: '4b1f5517210d01e86f0d',
  client_secret: '**************************',

  // user token cookieName
  token_cookie: 'ACCESS_TOKEN',

  // Personal access tokens
  token: '**************************',

  // 站点信息
  site: {
    logo: '',
    title: 'XiongWilee',
    subTitle: '知而获智，智达高远',
    year: new Date().getFullYear(),
    banner: 'https://img003.qufenqi.com/products/c0/72/c072f0506c961f6d1652531d60712c40.jpg',
    links: [{
      name: '趣店技术学院',
      url: 'https://qit-team.github.io'
    }, {
      name: '前端俱乐部',
      url: 'https://feclub.cn'
    }]
  }
}

function getPostList(issues) {
  let pageInfo = getPage(issues.headers.link);

  console.log(pageInfo);
}

/**
 * 获取文章的简介，即前5行内容
 * @param  {String} post 文章内容
 * @param  {Number} line 行数
 * @return {String}      文章简介
 */
function getPostIntro(body, line) {

}

/**
 * 通过头信息中的link字段，获取当前的分页信息
 * @param  {String} link 头信息中的link字段
 *                       <https://api.github.com/repositories/11551538/issues?state=all&page=4>; rel=\"next\", 
 *                       <https://api.github.com/repositories/11551538/issues?state=all&page=32>; rel=\"last\", 
 *                       <https://api.github.com/repositories/11551538/issues?state=all&page=1>; rel=\"first\", 
 *                       <https://api.github.com/repositories/11551538/issues?state=all&page=2>; rel=\"prev\"
 * @return {Object}      
 */
function getPage(link) {
  if (!link) return {};

  let result = {};
  let reg = /(<([\S]+)>)[\S\s]+\"([\w]+)\"/;
  link.split(',').forEach((item) => {
    let itemMatch = item.match(reg);
    if (itemMatch.length === 4) {
      result[itemMatch[3]] = querystring.parse(url.parse(itemMatch[2]).query);
    }
  })

  return result;
}

exports.config = config;
exports.getPostList = getPostList;
exports.getPage = getPage;
exports.__controller__ = false
