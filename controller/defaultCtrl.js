'use strict';

const base = require('./base.js');

module.exports = async function() {
  let access_token = this.cookies.get(base.config.token_cookie);

  let proxyObj = { 
    ownerInfo: `github_api:user?access_token=${base.config.token}`,
    repoInfo: `github_api:/repos/${base.config.owner}/${base.config.repo}`,
    labelInfo: `github_api:/repos/${base.config.owner}/${base.config.repo}/labels` 
  }
  let headersObj = { Authorization: `token ${base.config.token}` }

  // 如果存在用户的access_token，则通过用户的access_token请求
  if (access_token) {
    proxyObj.userInfo = `github_api:user?access_token=${access_token}`;
    headersObj.Authorization = `token ${access_token}`;
  }

  // 获取用户github信息
  await this.proxy(proxyObj, {
    headers: headersObj
  });

  // 用户的access token
  this.access_token = access_token;
  // 如果用户的access token不存在，则取默认的token
  this.token = access_token || base.config.token;

  // 仓储信息
  this.repoInfo = this.backData.repoInfo || {};
  // 仓储信息
  this.labelInfo = this.backData.labelInfo || {};
  // 用户信息
  this.userInfo = this.backData.userInfo || {};
  // 管理者信息
  this.ownerInfo = this.backData.ownerInfo || {};
  this.ownerInfo.logo_url = base.config.site.logo || `/user/avatar?img=${encodeURI(this.ownerInfo.avatar_url)}`;
  // 站点信息
  this.siteInfo = Object.assign({
    description: this.repoInfo.description
  }, base.config.site)

}
