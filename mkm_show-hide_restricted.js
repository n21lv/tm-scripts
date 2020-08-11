// ==UserScript==
// @name         Hide Restricted Articles
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hides articles from sellers on MKM that have restricted their articles
// @author       n21lv
// @match        https://www.cardmarket.com/*/Magic/Products/*/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
    var $j = jQuery.noConflict();
    'use strict';
    var hideRestricted = true;
    var cssObj = cssObj || {
        width: '110px',
        height: '32px',
        position: 'fixed',
        bottom: '3rem',
        right:'1rem',
        'z-index': '10000',
        'background-color': '#012169',
        'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        border: 'none',
        'border-radius': '4px',
        color: 'white',
        padding: '7px 12px',
        'text-align': 'center',
        'text-decoration': 'none',
        display: 'inline-block',
        'font-size': '0.8em',
        margin: '4px 2px',
        cursor: 'pointer',
    };

    var button = document.createElement('button'), btnStyle = button.style;
    document.body.appendChild(button);
    button.id = 'toggleHideShowRestricted';
    button.innerHTML = 'Hide Restricted';
    btnStyle.position = 'absolute';
    Object.keys(cssObj).forEach(function(key) {btnStyle[key] = cssObj[key]});
    $j('#toggleHideShowRestricted').click(function(e) {
        var stylePressed = {'background-color': '#a5afc4', 'text-shadow': '1px 1px #222'};
        var styleDepressed = {'background-color': '#012169', 'text-shadow': 'none'};
        var articles = $j('div.article-row:has(a.btn-grey)');
        switch (hideRestricted) {
            case true:
                articles.hide();
                $j(this).css(stylePressed);
                $j(this).html('Show Restricted');
                break;

            case false:
                articles.show();
                $j(this).css(styleDepressed);
                $j(this).html('Hide Restricted');
                break;
        }
        hideRestricted = !hideRestricted;
    });
})();
