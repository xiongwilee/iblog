require(['zepto', 'reveal', 'head', 'marked','iblog:/common/post-detail.js'], 
  function($, Reveal, head, marked, postDetail) {

    var postDetail = new postDetail();
    postDetail.render();

});
