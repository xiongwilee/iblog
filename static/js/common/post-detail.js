define(['zepto', 'reveal', 'head', 'marked', 'highlight'],
  function($, Reveal, head, marked, highlight) {

    function postDetail() {
      this.$postMarkdown = $('#postMarkdown');
      this.$postContainer = $('#postContainer');
      this.$commentsListContainer = $('#postCommentsList');
      this.$commentsFormContainer = $('#postCommentsForm');
      this.marked = this.setMarked();

      this.init();
    }

    postDetail.prototype = {
      init: function() {
        this.markdown = this.$postMarkdown.val();
        this.html = this.marked(this.markdown);
        this.issues_id = window.CONSTANT.issues_id;
      },
      setMarked: function() {
        // Synchronous highlighting with highlight.js
        marked.setOptions({
          highlight: function(code) {
            return hljs.highlightAuto(code).value;
          }
        });
        return marked;
      },
      render: function() {
        this.renderPost();
        this.renderCommentsList();
        this.renderCommentsForm();
      },
      renderPost: function() {
        this.$postContainer.html(this.html);
      },
      renderCommentsForm: function() {
        var me = this;

        $.get('/post/commentsform', function(html) {
          me.$commentsFormContainer.html(html);

          me.$postCommentsForm = me.$commentsFormContainer.children('.post-comments-form');

          console.log(me.$postCommentsForm)
        });

      },
      bindCommentsFormEvent: function() {},
      renderCommentsList: function(data) {
        var me = this;

        data = data || {};

        $.get('/post/commentslist/' + this.issues_id, {
          page: data.page || 1
        }, function(html) {
          me.$commentsListContainer.html(html);

          me.$postCommentsList = me.$commentsListContainer.children('.post-comments-list');

          me.setCommentsListDefault();
          me.bindCommentsListEvent();
        });
      },
      setCommentsListDefault: function() {
        var me = this;

        var $commentsContentList = me.$postCommentsList.find('.comments-detail-content');

        for (var i = 0; i < $commentsContentList.length; i++) {
          var $commentsContent = $($commentsContentList[i]);
          var markdown = $commentsContent.children('.comments-detail-markdown').val();

          $commentsContent.html(me.marked(markdown))
        }
      },
      bindCommentsListEvent: function() {
        var me = this;

        me.loadingPageFlag = false;
        me.$postCommentsList.on('click', '.page-item-change', function(evt) {
          evt.preventDefault();

          if (me.loadingPageFlag) return;

          me.loadingPageFlag = true;
          $(this).children('.page-icon-loading').show();
          $(this).children('.page-icon-arrow').hide();

          me.renderCommentsList({
            page: $(this).data('page')
          });
        });

        me.$postCommentsList.on('click', '.comments-detail-replay', function(evt) {
          evt.preventDefault();
          alert(1);
        });
      },
      setDefault: function() {

      }
    }

    return postDetail;
  });
