(function () {
  'use strict'

  if (!window.addEventListener) return // Check for IE9+

  var isPreview = INSTALL_ID === 'preview'
  var options = INSTALL_OPTIONS
  var element

  function getFullPath (path) {
    var a = document.createElement('a')
    a.href = path
    return a.href
  }

  function inIframe () {
    try {
      return window.self !== window.top
    } catch (e) {
      return true
    }
  }

  function getMeta (selector, property, isURL) {
    var value = null
    var el

    if (document.head && (el = document.head.querySelector(selector))) {
      value = el.getAttribute(property)

      if (isURL) {
        value = getFullPath(value)
      }
    }

    return value
  }

  function appendSDK () {
    // https://developers.facebook.com/docs/plugins/comments#configurator
    var fjs = document.getElementsByTagName('script')[0]

    if (document.getElementById('facebook-jssdk')) return

    var js = document.createElement('script')
    js.id = 'facebook-jssdk'
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9'
    fjs.parentNode.insertBefore(js, fjs)
  }

  function updateElement () {
    element = INSTALL.createElement(options.location, element)
    element.setAttribute('app', 'facebook-comments')
    element.setAttribute('data-position', options.position)

    if (!element.parentNode) return

    var canonicalUrl = window.location.protocol + '//' + window.location.hostname + window.location.pathname
    canonicalUrl = getMeta('meta[rel="canonical"][href]', 'href', true) || canonicalUrl
    canonicalUrl = getMeta('meta[property="og:url"][content]', 'content', true) || canonicalUrl

    if (isPreview && inIframe()) {
      element.innerHTML = '' +
        '<div class="fb-comments"><div class="cf-iframe-placeholder"></div></div>' +
      ''
    } else {
      element.innerHTML = '' +
        '<div class="fb-comments" data-href="' + canonicalUrl + '" data-numposts="' + options.numPosts + '"></div>' +
      ''
    }
  }

  function bootstrap () {
    if (!document.querySelector('#fb-root')) {
      var fbRoot = document.createElement('div')
      fbRoot.id = 'fb-root'
      document.body.appendChild(fbRoot)
    }

    updateElement()
    appendSDK()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap)
  } else {
    bootstrap()
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions (nextOptions) {
      options = nextOptions

      updateElement()
    },
    setPosition: function setPosition (nextOptions) {
      options = nextOptions

      if (element) {
        element.setAttribute('data-position', options.position)
      } else {
        updateElement()
      }
    }
  }
}())
