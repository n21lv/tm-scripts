// ==UserScript==
// @name         FaB Judge Deckchecking Assistant
// @namespace    https://github.com/n21lv/tm-scripts/blob/master/GEM_Deckcheck_Assistant/
// @version      2026-01-12
// @updateURL    https://github.com/n21lv/tm-scripts/raw/master/GEM_Deckcheck_Assistant/gem-decklist-checkboxes.user.js
// @downloadURL  https://github.com/n21lv/tm-scripts/raw/master/GEM_Deckcheck_Assistant/gem-decklist-checkboxes.user.js
// @description  Automatically adds checkboxes upon loading a decklist in GEM's print view
// @author       pantokrator (original code) and n21lv (TM port)
// @match        https://gem.fabtcg.com/gem/*/decklists/*/print/
// @icon         https://judge.fabtcg.com/static/Favicon_Judge_Hub.svg
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ================ FUNCTIONS ======================

    function updateCount(cardCountNode) {
        let currentCount = 1 * cardCountNode.dataset.currentCount;
        const totalCount = 1 * cardCountNode.dataset.totalCount;
        currentCount = currentCount < totalCount
            ? currentCount + 1
            : currentCount = 0;
        cardCountNode.dataset.currentCount = currentCount;
        cardCountNode.innerText = `${currentCount} / ${totalCount}`;
    }

    function styleCheckboxes() {
        const checkboxCSS = document.createElement(`style`);
        checkboxCSS.innerHTML = `
:root {
    --checkbox-unchecked: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" fill="white" stroke="%23999" stroke-width="2" rx="3"/></svg>');
    --checkbox-checked: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" fill="%234a90e2" stroke="%234a90e2" stroke-width="2" rx="3"/><path d="M5 9 L8 12 L13 6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
}

.deck-print__value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.deck-print__value::after {
    content: '';
    display: inline-flex;
    gap: 6px;
    height: 18px;
    margin-left: 8px;
    background-repeat: no-repeat;
}

/* Unchecked states */
.deck-print__key[data-total-count="1"] + .deck-print__value::after {
    width: 18px;
    background-image: var(--checkbox-unchecked);
}

.deck-print__key[data-total-count="2"] + .deck-print__value::after {
    width: 42px;
    background-image: var(--checkbox-unchecked), var(--checkbox-unchecked);
    background-position: left center, right center;
}

.deck-print__key[data-total-count="3"] + .deck-print__value::after {
    width: 66px;
    background-image: var(--checkbox-unchecked), var(--checkbox-unchecked), var(--checkbox-unchecked);
    background-position: left center, center center, right center;
}

/* Checked states */
.deck-print__key[data-current-count="1"][data-total-count="1"] + .deck-print__value::after {
    background-image: var(--checkbox-checked);
}
.deck-print__key[data-current-count="1"][data-total-count="2"] + .deck-print__value::after {
    background-image: var(--checkbox-checked), var(--checkbox-unchecked);
}
.deck-print__key[data-current-count="1"][data-total-count="3"] + .deck-print__value::after {
    background-image: var(--checkbox-checked), var(--checkbox-unchecked), var(--checkbox-unchecked);
}
.deck-print__key[data-current-count="2"][data-total-count="2"] + .deck-print__value::after {
    background-image: var(--checkbox-checked), var(--checkbox-checked);
}
.deck-print__key[data-current-count="2"][data-total-count="3"] + .deck-print__value::after {
    background-image: var(--checkbox-checked), var(--checkbox-checked), var(--checkbox-unchecked);
}
.deck-print__key[data-current-count="3"][data-total-count="3"] + .deck-print__value::after {
    background-image: var(--checkbox-checked), var(--checkbox-checked), var(--checkbox-checked);
}
    
/* Fully checked rows */
.deck-print__card-item:has(.deck-print__key[data-current-count="1"][data-total-count="1"]),
.deck-print__card-item:has(.deck-print__key[data-current-count="2"][data-total-count="2"]),
.deck-print__card-item:has(.deck-print__key[data-current-count="3"][data-total-count="3"]) {
    text-decoration: line-through;
    color: #666
}`;
       return document.head.appendChild(checkboxCSS);
    }

    // ================ MAIN PART ======================

    [
        `.deck-print__equipment-grid`,
        `.deck-print__main-cards-grid-col--1`,
        `.deck-print__main-cards-grid-col--2`,
        `.deck-print__main-cards-grid-col--3`,
    ].forEach((section_selector) => {
        const count_selector = `.deck-print__card-item:not(.deck-print__card-item--total) .deck-print__key`;
        let elementList = document.querySelectorAll(`${section_selector} ${count_selector}`);
        if (!elementList) {
            throw `Could not find a DOM element using selector "${section_selector}". The DOM layout might have changed`;
        }

        elementList.forEach((el) => {
            const DATA = el.dataset;
            if (DATA.currentCount === undefined) {
                DATA.currentCount = 0;
            };
            if (DATA.totalCount === undefined) {
                DATA.totalCount = 1 * el.innerText;
            }

            el.innerText = `${DATA.currentCount} / ${DATA.totalCount}`;
            el.parentNode.addEventListener(`click`, function (e) {
                updateCount(el);
            });
        });
    });

    styleCheckboxes();

})();
