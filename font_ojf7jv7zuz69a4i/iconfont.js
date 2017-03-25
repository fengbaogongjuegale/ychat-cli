;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-sousuo" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1015.778 959.565l-292.258-294.183c118.83-156.952 106.718-381.472-36.393-524.582-156.411-156.411-410.005-156.411-566.415 0-156.411 156.375-156.411 409.97 0 566.38 143.060 143.060 367.404 155.242 524.343 36.606l292.322 294.214c9.605 9.604 25.222 9.604 34.825 0l43.576-43.576c9.638-9.639 9.638-25.254-0.001-34.859zM194.915 635.147c-114.862-114.861-114.862-301.083 0-415.909 114.863-114.862 301.046-114.862 415.91 0 114.863 114.826 114.863 301.048 0 415.909-114.864 114.863-301.047 114.863-415.91 0z" fill="#ffffff" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-5" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M464 560 0 560 0 464 464 464 464 0 560 0 560 464 1024 464 1024 560 560 560 560 1024 464 1024 464 560Z" fill="#ffffff" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-sousuo-copy" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1015.7783 938.2318 723.5205 644.0489c118.8301-156.9516 106.7182-381.4717-36.393-524.5819-156.4109-156.4109-410.0045-156.4109-566.4154 0-156.4109 156.375-156.4109 409.9697 0 566.3805 143.06 143.06 367.404 155.2425 524.3433 36.606l292.3223 294.2136c9.6051 9.6041 25.2221 9.6041 34.8252 0l43.5763-43.5763C1025.4172 963.4519 1025.4172 947.8369 1015.7783 938.2318zM194.9153 613.8132c-114.8621-114.8611-114.8621-301.0826 0-415.9089 114.8631-114.8621 301.0458-114.8621 415.9099 0 114.8631 114.8262 114.8631 301.0478 0 415.9089C495.9611 728.6764 309.7784 728.6764 194.9153 613.8132z" fill="#d4237a" ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)