'use strict';

const base = require('./base.js');

exports.detail = async function() {
  await this.bindDefault();

  let issueId = parseInt(this.params.id) || 1;

  await this.proxy({
    issue: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues/${issueId}`
  }, {
    headers: { 'Authorization': `token ${this.token}` }
  })



  await this.render('post-detail', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: base.getPost(this.backData.issue)
  })
}

exports.detail.__regular__ = '/:id'

exports.label = async function() {
  await this.bindDefault();

  let page = parseInt(this.query.page) || 1;
  let label = this.params.id ? this.params.id.toString() : 'blog';

  let res = await this.proxy({
    issues: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues?state=open&page=${page}&labels=${label}`
  }, {
    headers: { 'Authorization': `token ${this.token}` }
  });

  this.siteInfo.label = label;

  let postInfo = base.getPostList(res.issues);
  Object.assign(postInfo.page, {
    curr: page,
    total: postInfo.page.last || 1
  })

  await this.render('post-label', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
  })
}

exports.label.__regular__ = '/:id'