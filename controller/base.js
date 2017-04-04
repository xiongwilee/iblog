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
  client_secret: '8806946fefe51e423c18d36cf8ab0c946e68a94f',

  // user token cookieName
  token_cookie: 'ACCESS_TOKEN',

  // Personal access tokens
  token: '4904bdde6f44f4332dd553552ccf8cd6260592f5',

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

/**
 * 根据需求补充文章内容数据
 * @param  {Object} post 文章数据
 * @return {Object}      补充之后的文章数据
 */
function getPost(post) {
  if (!post || !post.body) return {};


  let postQuery = getPostQuery(post.body);
  let postIntro = postQuery.intro || getPostIntro(post.body);

  Object.assign(post, {
    intro: postIntro,
    query: postQuery,
    create_time: formatTime(post.created_at),
    update_time: formatTime(post.updated_at)
  })

  return post;
}

/**
 * 根据需求补充文章列表数据
 * @param  {Object} issues issues请求数据
 * @return {Object}        分页及文章列表数据
 */
function getPostList(issues) {
  if (!issues.body || !issues.headers) return;

  let pageInfo = getPage(issues.headers.link);
  let pageList = [];

  issues.body.forEach((item) => {
    // 如果文章不存在分类，则不展示出来，该功能先取消
    // if (!item.labels || item.labels.length === 0) return;

    pageList.push(getPost(item));
  });

  return {
    page: pageInfo,
    list: pageList
  }
}

/**
 * 格式化文档时间
 * @param  {String} time 时间戳
 * @return {String}      格式化之后的时间
 */
function formatTime(time) {
  let date = new Date(time);

  return (date.getFullYear() + '-' +
    zeroPad(date.getMonth() + 1) + '-' +
    zeroPad(date.getDate()) + ' ' +
    zeroPad(date.getHours()) + ':' +
    zeroPad(date.getMinutes()) + ':' +
    zeroPad(date.getSeconds()));

  function zeroPad(num) {
    return ('0' + num).slice(-2)
  }
}

/**
 * 获取文章的简介，即前5行内容
 * @param  {String} post 文章内容
 * @param  {Number} line 行数，默认为10行
 * @return {String}      文章简介
 */
function getPostIntro(body) {
  let isBlankReg = /^\s+$/,
    start = 0;
  return body.split('\n').filter((item) => {
    if (start < 5 && !isBlankReg.test(item)) {
      start++;
      return true;
    }
  }).join('\n')
}

/**
 * 获取文章的配置参数，在文章头部通过[key]: value 的形式
 * @param  {String} body 文章内容
 *                       [intro]: 文章的介绍文章的介绍文章的介绍
 * @return {Object}      文章的配置参数
 */
function getPostQuery(body) {
  if (!body) return {};

  let result = {};
  let commentReg = /\[(\w+)\]\:\s+(\S+)/;
  body.split('\n').every((item) => {
    let itemMatch = item.match(commentReg);
    if (itemMatch && itemMatch.length == 3) {
      result[itemMatch[1]] = itemMatch[2];
      return true;
    } else {
      return false;
    }
  })

  return result;
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
    if (itemMatch && itemMatch.length === 4) {
      let query = querystring.parse(url.parse(itemMatch[2]).query);
      result[itemMatch[3]] = query.page;
    }
  })

  return result;
}

exports.config = config;

exports.getPost = getPost;
exports.getPostList = getPostList;
exports.formatTime = formatTime;
exports.getPostIntro = getPostIntro;
exports.getPostQuery = getPostQuery;
exports.getPage = getPage;

exports.__controller__ = false
