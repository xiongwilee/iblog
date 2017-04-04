define(['zepto'], function($) {

  /**
   * 添加评论
   * @param {Object}   data     评论数据
   * @param {Function} callback 
   */
  function addComments(data, callback) {
    $.post('/api/comments/create', {
      issues_id: data.issues_id,
      body: data.body
    }, function(data) {
      console.log(data)
    })
  }

  /**
   * 获取评论列表
   * @param  {Object}   data 			配置数据
   *                    data.issues_id	issues_id
   *                    data.page 		页码
   * @param  {Function} callback  		回调函数
   * @return 
   */
  function getCommentsList(data, callback) {
    $.get('/api/comments/list', {
      issues_id: data.issues_id,
      page: data.page
    }, function(data) {
      console.log(data)
    })
  }

  /**
   * 获取用户信息
   * @param  {Function} callback 获取用户信息
   * @return 
   */
  function getUserInfo(callback) {
    $.get('/api/user/info', function(data) {
      console.log(data)
    })
  }
  return {
    addComments : addComments,
    getCommentsList : getCommentsList,
    getUserInfo : getUserInfo
  }
});
