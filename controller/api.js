'use strict';

const base = require('./base.js');

module.exports = {
  'comment': {
    create: async function() {
      let access_token = this.cookies.get(base.config.token_cookie);

      let issueId = parseInt(this.request.body.issue_id) || 1;

      await this.proxy(`github_api:post:/repos/${base.config.owner}/${base.config.repo}/issues/${issueId}/comments`, {
        form: JSON.stringify({
          body: '**testtest**'
        }),
        headers: { 'Authorization': `token ${access_token}` }
      })
    },
    list: async function() {
      let access_token = this.cookies.get(base.config.token_cookie);

      let issueId = parseInt(this.query.issue_id) || 1;

      await this.proxy('github_api:get:/repos/${base.config.owner}/${base.config.repo}/issues/${issueId}/comments', {
        form: JSON.stringify({
          body: '**testtest**'
        }),
        headers: { 'Authorization': `token ${access_token}` }
      })
    }
  }
}
