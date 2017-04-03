'use strict';

const url = require('url');
const base = require('./base.js');

exports.login = async function() {
  await this.bindDefault();

  // 如果已经登录就不用再登录，直接重定向到首页
  if (this.userInfo.id) {
    return console.log(this.userInfo);
  }

  // 重定向到github oauth登录页
  var path = "https://github.com/login/oauth/authorize";
  path += '?client_id=' + base.config.client_id;
  path += '&redirect_uri=' + this.request.protocol + '://' + this.request.host + '/user/oauth?from=github';
  path += '&scope=user,repo';
  path += '&state=' + (new Date()).valueOf();

  this.redirect(path);
}

exports.logout = async function() {
  this.cookies.set(base.config.token_cookie, '', {
    expires: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  });
  this.redirect('/home');
}

exports.avatar = async function (){
  let query = this.query;
  try{
    let urlObj = url.parse(query.img);
    await this.fetch('https://avatars.githubusercontent.com' + urlObj.path);
  }catch(err){
    this.body = {
      code: '1',
      message: 'img path error',
      data: query
    }
  }
}

exports.oauth = async function() {
  // 为所有的GITHUB请求设置头信息为Accept参数为'application/json'
  this.headers.accept = 'application/json';

  // 获取access_token
  let code = this.query.code; 
  await this.proxy({
    oauthInfo: 'github:post:login/oauth/access_token?client_id=' + base.config.client_id + '&client_secret=' + base.config.client_secret + '&code=' + code
  })
  let access_token = this.backData.oauthInfo.access_token;
  // 如果没有获取到access_token则直接返回
  if (!access_token) {
    this.body = {
      code: 1,
      message: 'Get access_token error',
      data: this.backData
    };
    return;
  }

  // 设置COOKIE，时效为30天
  let expiresTime = Date.now() + 1000 * 60 * 60 * 24 * 30;
  this.cookies.set(base.config.token_cookie, access_token, {
    expires: new Date(expiresTime)
  });

  this.redirect('/');
}