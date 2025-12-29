// ==UserScript==
// @name         MKM Helper
// @namespace    https://gist.github.com/n21lv/ca7dbefd5955afc7205049ad950aec96
// @updateUrl    https://gist.github.com/n21lv/ca7dbefd5955afc7205049ad950aec96/raw/mkm_helper.user.js
// @downloadUrl  https://gist.github.com/n21lv/ca7dbefd5955afc7205049ad950aec96/raw/mkm_helper.user.js
// @version      0.8
// @description  Various useful UI modifications for Cardmarket (Magic & FaB)
// @author       n21lv
// @match        https://www.cardmarket.com/*/Magic/Products/*/*
// @match        https://www.cardmarket.com/*/FleshAndBlood/Products/*/*
// @match        https://www.cardmarket.com/*/Magic/Cards/*
// @match        https://www.cardmarket.com/*/FleshAndBlood/Cards/*
// @match        https://www.cardmarket.com/*/Magic/Wants/*
// @match        https://www.cardmarket.com/*/FleshAndBlood/Wants/*
// @match        https://www.cardmarket.com/*/Magic/Orders/*
// @match        https://www.cardmarket.com/*/FleshAndBlood/Orders/*
// @match        https://www.cardmarket.com/*/Magic/ShoppingCart
// @match        https://www.cardmarket.com/*/FleshAndBlood/ShoppingCart
// @match        https://www.cardmarket.com/*/Magic/Users/*/Offers/Singles*
// @match        https://www.cardmarket.com/*/FleshAndBlood/Users/*/Offers/Singles*
// @match        https://www.cardmarket.com/*/Magic/Orders/Search/Results*
// @match        https://www.cardmarket.com/*/FleshAndBlood/Orders/Search/Results*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * ============== CONSTANTS ==============
     */
    const SEARCH_PERIOD = 59; // "2 months"
    const HREF = window.location.href;
    const game = window.location.pathname.split('/')[2].toLowerCase();
    const cardNameRegexClean = /^([^(]*).*/; // used for search and exporting card lists to clipboard
    const fabCardNameRegex = /^([^(\n]*)\s?(\((red|yellow|blue)\))?/i;

    /**
     * ============== FUNCTIONS ==============
     */

    window.writeToClipboard = function (contents, callback) {
        navigator.clipboard.writeText(contents).then(callback);
    };

    function processShowHideRestrictedClick(forceHide) {
        let s = ``;
        const button = _j$('#toggleHideShowRestricted');
        const buttonProperties = {
            hide: {
                css: { 'background-color': '#a5afc4', 'text-shadow': '1px 1px #222' },
                title: 'Show Restricted'
            },
            show: {
                css: { 'background-color': '#012169', 'text-shadow': 'none' },
                title: 'Hide Restricted',
            }
        };

        let articles = _j$('div.article-row:has(a.btn-grey)');
        let shouldHide = forceHide ?? window.hideRestricted;
        let action = shouldHide ? 'hide' : 'show';

        articles[action]();
        button.css(buttonProperties[action].css);
        button.html(buttonProperties[action].title);

        if (typeof window.hideRestricted != 'undefined') {
            window.hideRestricted = !window.hideRestricted;
            s = `: window.hideRestricted=${window.hideRestricted},`;
        }
    }

    function processHideNewRestricted() {
        // Hide newly rendred rows if user clicked "Show more results"

        if (isLoggedIn && window.hideRestricted === false) {
            let articles = _j$('div.article-row:has(a.btn-grey)');
            if (articles.length > 0) {
                articles.hide();
            } else {
                console.log(`articles seems to be undefined:`, articles);
            }
        }
    }

    function processAddSearchIcon() {
        /**
         *  Renders a link icon next to every article that allows for quick checks if you have already ordered it. Useful for tidying up wants lists
         */

        const iconSize = isProductsSinglesPage ?
            ' small' :
            '';
        const SHIPMENTSTATUS_PAST = 200; // change this when MKM devs introduce a status which doesn't include in-cart items
        const selector = isWantsPage || isCartPage
            ? 'td.name'
            : isOffersSinglesPage
                ? 'div.col-seller:gt(0)'
                : '.page-title-container h1:first-child';

        (() => _j$(selector).each(function () {
            // Get rid of (V.1) and other confusing character sequences
            const cardName = isProductsSinglesPage
                ? _j$(this).contents().filter(function () { return this.nodeType == Node.TEXT_NODE; }).text()
                : _j$(this).text();
            const regexToUse = game == 'fleshandblood'// && (isProductsSinglesPage || isWantsPage)
                ? fabCardNameRegex
                : cardNameRegexClean;

            const matchNum = game == 'magic' ? 1 : 0; // For MTG we return Match 1, for other games we return Match 0
            let productNameClean = regexToUse.exec(cardName)[matchNum].trim();
            if (game == 'fleshandblood') {
                // Remove foiling info, as it is not searchable
                productNameClean = productNameClean.replace(/[()]*/g, '').trim();
            }

            if (!_j$(this).data('hasSearchIcon')) {
                const now = new Date();
                const maxDate = now.toLocaleDateString('lt-LT'); // uses ISO date format
                const minDate = new Date(new Date(now).setDate(now.getDate() - SEARCH_PERIOD)).toLocaleDateString('lt-LT');
                let searchParams = new URLSearchParams([
                    ['productName', productNameClean],
                    ['shipmentStatus', SHIPMENTSTATUS_PAST],
                    ['minDate', minDate],
                    ['maxDate', maxDate],
                ]).toString();

                let searchIconHTML = `<a href="/Orders/Search/Results?userType=buyer&${searchParams}" target="_blank" title="Search in my most recent shipments" style="text-decoration: none;"><span class="fonticon-search mr-1${iconSize}" style="padding-right: 4px;"></span></a>`;
                _j$(this).prepend(searchIconHTML);
                _j$(this).data('hasSearchIcon', true);
            }
        }))();
    }

    function navigateSearchResults(direction) {
        const urlParams = new URLSearchParams(window.location.search);
        const pointOfOrigin = direction === 'back' ? urlParams.get('minDate') : urlParams.get('maxDate');
        let dateDiff = direction === 'back' ? -SEARCH_PERIOD : SEARCH_PERIOD;
        const fromDate = new Date(pointOfOrigin);

        let newMinDate = new Date(fromDate).setDate(fromDate.getDate() + dateDiff); // subtract SEARCH_PERIOD if moving back, add if moving forward
        let newMaxDate = new Date(fromDate);
        if (direction !== 'back') {
            [newMinDate, newMaxDate] = [newMaxDate, newMinDate];
        }

        urlParams.set(`minDate`, new Date(newMinDate).toLocaleDateString('lt-LT'));
        urlParams.set(`maxDate`, new Date(newMaxDate).toLocaleDateString('lt-LT'));
        return (() => window.location.search = urlParams.toString())();
    }

    // Process new elements added to DOM tree, e.g. user clicked "Show more results" or added items to cart
    function processNewNodes() {
        if (!shouldRefreshSearchIcons && !shouldRefreshRestricted) {
            return;
        }

        let action = shouldRefreshSearchIcons
            ? 'shouldRefreshSearchIcons'
            : 'shouldRefreshRestricted';

        let processingProperties = {
            shouldRefreshRestricted: {
                handler: processHideNewRestricted,
                targetNodeSelector: 'section#table div.table-body'
            },
            shouldRefreshSearchIcons: {
                handler: processAddSearchIcon,
                targetNodeSelector: (
                    isOffersSinglesPage
                        ? 'div#UserOffersTable div.table-body'
                        : isWantsPage
                            ? '#WantsListTable tbody'
                            : 'table[id^=ArticleTable] tbody'
                )
            }
        };

        const targetNode = document.querySelector(processingProperties[action].targetNodeSelector);
        if (!targetNode) {
            console.log(`navigateSearchResults(): targetNode is not defined`);
            return;
        }

        const observerOptions = { childList: true };
        const observer = new MutationObserver((mutationList, observer) => mutationList.forEach((mutation) => {
            let processingFunc = processingProperties[action].handler;
            if (mutation.type === 'childList') {
                if (typeof processingFunc !== 'undefined') {
                    processingFunc();
                } else {
                    console.log(`navigateSearchResults(): processingFunc seems to be undefined`);
                }
            }
        }));
        observer.observe(targetNode, observerOptions);
    }

    /**
     * ============== MAIN PART ==============
     */

    var _j$;

    if (typeof window.jQuery !== 'undefined') {
        _j$ = window.jQuery;
    } else {
        console.log('jQuery does not seem to be defined');
    }

    var isProductsOrCardsPage = HREF.indexOf('/Products') > -1 || HREF.indexOf('/Cards') > -1;
    var isWantsPage = HREF.indexOf('/Wants') > -1;
    var isCartPage = HREF.indexOf('/ShoppingCart') > -1;
    var isOffersSinglesPage = HREF.indexOf('Offers/Singles') > -1;
    var isProductsSinglesPage = HREF.indexOf('Products/Singles') > -1 || HREF.indexOf('/Cards') > -1;
    var isOrdersPage = HREF.indexOf('/Orders') > -1;
    var isSearchResultsPage = HREF.indexOf('/Search/Results') > -1;
    var isLoggedIn = !(_j$('#login-signup').length > 0);

    var docHead, style;
    docHead = document.getElementsByTagName('head')[0];
    if (!docHead) { return; }
    style = document.createElement('style');
    style.innerHTML = `span#custom-tooltip {
            position: absolute;
            display: block;
            margin-left: 40px;
            padding: 5px 12px;
            background-color: #000000df;
            border-radius: 4px;
            color: #fff;
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s 2s, opacity 2s ease-out;
            z-index: 10000;
    }

    span#custom-tooltip.visible {
        visibility: visible;
        opacity: 1;
        transition: visibility 0s, opacity 0s;
    }`;
    docHead.appendChild(style);

    (function processProductsOrCardsPage() {
        /**
         *  Renders a button that hides/shows articles that you cannot buy (those which have the 'Put in shopping cart' button grayed out)
         */
        if (!isProductsOrCardsPage) {
            return;
        }

        var cssObjHideRestricted = cssObjHideRestricted || {
            width: '110px',
            height: '32px',
            position: 'fixed',
            bottom: '3rem',
            right: '1rem',
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

        var btnHideRestricted = document.createElement('button'), btnHRStyle = btnHideRestricted.style;
        document.body.appendChild(btnHideRestricted);
        btnHideRestricted.id = 'toggleHideShowRestricted';
        btnHideRestricted.innerHTML = 'Hide Restricted';
        btnHRStyle.position = 'absolute';
        Object.keys(cssObjHideRestricted).forEach(function (key) { btnHRStyle[key] = cssObjHideRestricted[key]; });

        _j$('#toggleHideShowRestricted').on('click', () => {
            // This form is necessary in order for handler being properly processed by jQuery
            processShowHideRestrictedClick();
            return;
        });

        if (isLoggedIn) {
            const domNodeHideRestricted = _j$('#toggleHideShowRestricted');
            if (domNodeHideRestricted.length > 0) {
                if (typeof window.hideRestricted == 'undefined') {
                    window.hideRestricted = true;
                }
                domNodeHideRestricted.trigger('click');
            }
        }
    })();

    window.searchBack = () => {
        navigateSearchResults('back');
    };

    window.searchForward = () => {
        navigateSearchResults('forward');
    };

    (function addSearchNavigation() {
        if (!isSearchResultsPage) {
            return;
        }

        const contentSection = _j$('section');
        if (contentSection.length < 1) {
            console.log(`addSearchNavigation(): Couldn't find contentSection`);
            return;
        }

        const btnSearchForward = `<a href="#" class="btn btn-outline-primary" role="button" onclick="searchForward()" style="float: right;" title="Forward 2 months"><span><i class="fonticon-calendar"></i><i class="fonticon-chevron-right"></i></span></a>`;
        const btnSearchBack = `<a href="#" class="btn btn-outline-primary ms-2" role="button" onclick="searchBack()" style="float: right;" title="Back 2 months"><span><i class="fonticon-chevron-left"></i><i class="fonticon-calendar"></i></span></a>`;
        contentSection.prepend(btnSearchForward, btnSearchBack);

        // Display the current range
        const urlSearchParams = new URLSearchParams(window.location.search);
        const dates = {
            from: urlSearchParams.get('minDate'),
            to: urlSearchParams.get('maxDate'),
        };
        const searchPaginationControls = _j$('section .pagination');

        if (searchPaginationControls.length > 0) {
            searchPaginationControls.first().before(`<div style="display: flex; flex-direction: row; justify-content: flex-end;"><div id="searchRange" style="margin: -11.5px 0px 0px; font-size: 0.8em; color: var(--bs-gray-500); float: right;">${dates.from} .. ${dates.to}</div></div>`);
        }
    })();

    let shouldRefreshSearchIcons = isWantsPage || isCartPage || isOffersSinglesPage;
    let shouldRefreshRestricted = isProductsOrCardsPage;

    // Initial processing on page load
    if (shouldRefreshSearchIcons || isProductsSinglesPage) {
        processAddSearchIcon();
    }

    if (shouldRefreshSearchIcons) {
        processNewNodes();
    }

    const loadMoreBtn = document.getElementById('loadMoreButton');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            processNewNodes(true);
        });
    }

    (function processWantsPage() {
        function addExportWantsToClipboardBtn() {
            var wants = '';
            const wantsTable = document.querySelectorAll('#WantsListTable tbody tr[role="row"]');
            wantsTable.forEach((row) => {
                let cardQty = parseInt(row.querySelector('td[data-amount]').dataset.amount);
                let cardName = row.querySelector('td.name a:last-child').text;
                wants += `${cardQty} ${cardName}\r\n`;
            });

            const rightmostButtons = document.querySelectorAll('div.flex-column div:last-child a[role="button"]');
            const newBtn = document.createElement('a');
            newBtn.innerHTML = `<a id="CopyWantsToClipboard" href="#CopyToClipboard" role="button" class="btn copyToClipboard-linkBtn btn-outline-primary me-3 mt-2 mt-lg-0">Copy to Clipboard</a><span id="custom-tooltip">Copied!</span>`;

            if (!window.location.pathname.includes('ShoppingWizard')) {
                rightmostButtons[0].parentElement.insertBefore(newBtn, rightmostButtons[0]);
            }

            return wants;
        }

        /**
         * Renders the sum of all prices in the current wants list next to card total count
         */
        function renderTotalPrice() {
            let wantsTable = document.querySelector('section#WantsListTable');
            if (!wantsTable) {
                return;
            }

            let total = 0;
            let wantsTableRows = document.querySelectorAll('#WantsListTable tbody tr');
            wantsTableRows.forEach(function (el) {
                let amount = parseInt(el.querySelector('td[data-amount]').dataset.amount);
                let price = parseFloat(el.querySelector('td[data-text]').dataset.text);
                total += amount * price;
            });
            let totalPriceNode = document.createElement('div');
            totalPriceNode.style.margin = '-13.5px 0 7.5px';
            totalPriceNode.style.fontSize = '0.9em';
            totalPriceNode.style.color = 'var(--gray)';
            totalPriceNode.innerText = `Approx. total price (using buy prices): ${total.toFixed(2)} €`;
            wantsTable.insertBefore(totalPriceNode, wantsTable.firstChild.nextSibling);
        }


        if (!isWantsPage) {
            return;
        }

        const wantsList = addExportWantsToClipboardBtn();
        const copyWantsToClipboardBtn = document.getElementById('CopyWantsToClipboard');

        if (copyWantsToClipboardBtn) {
            copyWantsToClipboardBtn.addEventListener('click', (e) => window.writeToClipboard(wantsList, function () {
                document.getElementById("custom-tooltip").classList.toggle('visible');
                setTimeout(function () {
                    document.getElementById("custom-tooltip").classList.toggle('visible');
                }, 2000);
            }));
        }
        renderTotalPrice();


    })();

    (function processOrdersPage() {
        /**
         *  Renders an extra button for exporting the order contents to CSV that Deckbox.org can read
         */

        if (!isOrdersPage) {
            return;
        }

        const conditionsDB = {
            1: 'Mint',
            2: 'Near Mint',
            3: 'Near Mint',
            4: 'Good (Lightly Played)',
            5: 'Played',
            6: 'Heavily Played',
            7: 'Poor'
        };
        const langDB = {
            1: 'English',
            2: 'French',
            3: 'German',
            4: 'Spanish',
            5: 'Italian',
            6: 'Simplified Chinese',
            7: 'Japanese',
            8: 'Portuguese',
            9: 'Russian',
            10: 'Korean',
            11: 'Traditional Chinese'
        };

        var arrArticles = [];
        _j$('table[id^=ArticleTable]>tbody tr').each(function (index) {
            // get rid of (V.1) and other confusing character sequences and escape the name
            let regex = game == 'magic'
                ? cardNameRegexClean // removes stuff like (V.1) and other weird sequences
                : /(.*)/; // keeps everything, FaB uses that to indicate colours and foilings


            var pName = regex.exec(_j$(this).data('name'))[1].replace('Æ', 'Ae').replace('æ', 'ae').trim();
            arrArticles.push({
                Count: _j$(this).data('amount'),
                Name: '"' + pName + '"',
                Edition: '"' + _j$(this).data('expansion-name') + '"',
                'Card Number': _j$(this).data('number'),
                Condition: conditionsDB[_j$(this).data('condition')],
                Language: langDB[_j$(this).data('language')],
                Foil: _j$(this).has('div.col-extras span[aria-label="Foil"]').length // NB: data attributes are set after page load
            });
        });

        _j$('#collapsibleExport p.font-italic.small').text('Click here to export your articles to a CSV document or copy them to clipboard.');
        _j$('#collapsibleExport').append(`<input id="exportToText" type="submit" value="Copy to Clipboard" title="Copy order contents as plain text to clipboard" class="btn my-2 btn-block btn-sm btn-outline-primary"><span id="custom-tooltip">Copied!</span>`);

        /**
         * TODO: This is only needed for MTG, but it's not determined by `game` variable, instead
         * there are multiple sections with cards from each game
         */
        if (game == 'magic') {
            _j$('#collapsibleExport').append(`<input id="exportToDeckbox" type="submit" value="Export (Deckbox.org)" title="Export to Deckbox.org CSV" class="btn my-2 btn-block btn-sm btn-outline-primary">`);
            _j$('#exportToDeckbox').on('click', function (e) {
                let headers = Object.keys(arrArticles[0]);
                let orderId = _j$('.page-title-container h1').text().replace(/[^0-9]*/, '');
                window.exportCSVFile(headers, arrArticles, `MKM Order ${orderId}`, true);
            });
        }

        _j$('#exportToText').on('click', function (e) {
            window.exportToText(arrArticles);
        });
    })();

})();

/***********************************************************************
 * JSON2CSV converter by dannypule (https://gist.github.com/dannypule) *
 ***********************************************************************/
window.convertToCSV = function (objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ',';
            line += array[i][index];
        }
        str += line + '\r\n';
    }

    return str;
};

window.exportCSVFile = function (headers, items, fileTitle) {
    let csvArray = Array.from(items);
    if (headers) {
        csvArray.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(csvArray);
    var csv = this.convertToCSV(jsonObject);

    var exportedFilename = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

window.exportToText = function (objArray, useMTGAFormat) {
    // useMTGAFormat = useMTGAFormat ?? false;
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    // var sets = window.mtgSets;

    array.forEach(article => {
        var line = article.Count + ' ' + article.Name.replace(/"*/g, '').replace('Æ', 'Ae').replace('æ', 'ae');
        str += line + '\r\n';
    });

    window.writeToClipboard(str, function () {
        document.getElementById("custom-tooltip").classList.toggle('visible');
        setTimeout(function () {
            document.getElementById("custom-tooltip").classList.toggle('visible');
        }, 2000);
    });

};