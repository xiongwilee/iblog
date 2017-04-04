'use strict';

const base = require('./base.js');

exports.detail = async function() {
  await this.bindDefault();

  let issuesId = parseInt(this.params.id) || 1;

  await this.proxy({
    issue: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues/${issuesId}`
  }, {
    headers: { 'Authorization': `token ${base.config.token}` }
  })

  let postInfo = base.getPost(this.backData.issue);
  this.siteInfo.title = `${postInfo.title} - ${this.siteInfo.title}`;

  await this.render('post-detail', {
    constant: {
      issues_id: issuesId
    },
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
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
    headers: { 'Authorization': `token ${base.config.token}` }
  });

  this.siteInfo.label = label;

  let postInfo = base.getPostList(res.issues);
  Object.assign(postInfo.page, {
    curr: page,
    total: postInfo.page.last || 1
  })

  this.siteInfo.title = `${page} - ${this.siteInfo.title}`;

  await this.render('post-label', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: postInfo
  })
}

exports.label.__regular__ = '/:id'