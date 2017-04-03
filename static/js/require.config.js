requirejs.config({
  baseUrl: '/',
  shim: {
  },
  map: {
    '*': {
      'iblog:': 'iblog/static/js'
    }
  },
  paths: {
    'zepto': 'iblog/static/js/lib/zepto.min'
  }
});
