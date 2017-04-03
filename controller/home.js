'use strict';

const base = require('./base.js');

exports.index = async function() {
  await this.bindDefault();

  let page = parseInt(this.query.page) || 1;

  let res = await this.proxy({
    // issues: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues?state=open&page=${page}`
    issues: `github_api:/repos/koajs/koa/issues?state=all&page=3`
  }, {
    headers: { 'Authorization': `token ${this.token}` }
  })

  // 解析返回请求中的issues列表
  let postInfo = base.getPostList(res.issues);

return this.body = res;

  await this.render('home', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: Object.assign({
      page: page,
      num: this.repoInfo.open_issues_count
    }, {
      list: this.backData.issues || []
    })
  })
}
