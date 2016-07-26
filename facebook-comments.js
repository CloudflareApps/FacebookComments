window.EagerFacebookComments = {
  init: function(element, options) {
    if (!element.parentNode) return;

    var getFullPath = function(path) {
      var a = document.createElement('a');
      a.href = path;
      return a.href;
    };

    var getMeta = function(selector, property, isURL) {
      var el, value;

      value = null;

      if (document.head && (el = document.head.querySelector(selector))) {
        value = el.getAttribute(property);

        if (isURL) {
          value = getFullPath(value);
        }
      }

      return value;
    };

    var canonicalUrl = window.location.protocol + '//' + window.location.hostname + window.location.pathname;
    canonicalUrl = getMeta('meta[rel="canonical"][href]', 'href', true) || canonicalUrl;
    canonicalUrl = getMeta('meta[property="og:url"][content]', 'content', true) || canonicalUrl;

    if (!document.querySelector('#fb-root')) {
      var fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }

    // https://developers.facebook.com/docs/plugins/comments#configurator
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    element.innerHTML = '' +
      '<style>eager-app .fb-comments, eager-app .fb-comments iframe[style], eager-app .fb-comments > span { width: 100% !important }</style>' +
      '<div class="fb-comments" data-href="' + canonicalUrl + '" data-numposts="' + options.numPosts + '"></div>' +
    '';
  }
};
