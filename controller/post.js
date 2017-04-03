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
    postInfo: this.backData.issue || {}
  })
}

exports.detail.__regular__ = '/:id'

exports.label = async function() {
  await this.bindDefault();

  let page = parseInt(this.query.page) || 1;
  let label = this.params.id ? this.params.id.toString() : 'blog';

  await this.proxy({
    issues: `github_api:/repos/${base.config.owner}/${base.config.repo}/issues?state=open&page=${page}&labels=${label}`
  }, {
    headers: { 'Authorization': `token ${this.token}` }
  });

  this.siteInfo.label = label;

  await this.render('post-label', {
    ownerInfo: this.ownerInfo,
    labelInfo: this.labelInfo,
    siteInfo: this.siteInfo,
    userInfo: this.userInfo,
    postInfo: {
      page: page,
      num: this.repoInfo.open_issues_count,
      list: this.backData.issues || []
    }
  })
}

exports.label.__regular__ = '/:id'