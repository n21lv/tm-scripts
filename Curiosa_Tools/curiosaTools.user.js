// ==UserScript==
// @name         Curiosa Toolbox
// @namespace    https://curiosa.io/
// @version      2026-04-13
// @description  Custom hotkey handler and other UX improvements for curiosa.io
// @author       n21lv
// @match        https://curiosa.io/collection?tab=edit
// @match        https://curiosa.io/cards
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curiosa.io
// @grant        none
// ==/UserScript==

(function curiosaToolbox() {
    'use strict';

    function getSearchField() {
        return document.querySelector('[placeholder="Search cards..."]');
    }

    function addSelectedCard() {
        updateCardAmount('+');
    }

    function removeSelectedCard() {
        updateCardAmount('-');
    }

    function focusSearchField() {
        curiosaToolbox.searchField.focus();
        curiosaToolbox.searchField.setSelectionRange(0, curiosaToolbox.searchField.value.length, 'forward');
    }

    function updateCardAmount(direction) {
        const btnToClick = direction === '+'
        ? curiosaToolbox.addCardBtn
        : curiosaToolbox.removeCardBtn;
        setTimeout(() => {
            btnToClick.click();
        }, 100);
        focusSearchField();
    }

    document.addEventListener('keydown', function(e) {

        const searchField = curiosaToolbox.searchField = getSearchField();
        const searchFieldHasFocus = document.activeElement === searchField;

        // Focus the Card Search field, but allow the native Search to work
        if (e.key == '/') {
            if (e.ctrlKey == false && searchField && !searchFieldHasFocus) {
                focusSearchField();
                e.preventDefault();
            } else if (e.ctrlKey == true && searchField && searchFieldHasFocus) {
                /**
                 * The original handler seems to be firing earlier, so we need to
                 * dispatch another Ctrl + / keypress explicitly
                 **/
                searchField.blur();
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: '/',
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true
                }));
            }
        }

        const cardCountElement = document.querySelector('.h-\\[25px\\].w-\\[20px\\].text-center');

        // The rest will not work if we haven't selected a card yet
        if (!cardCountElement) { return }

        curiosaToolbox.addCardBtn = cardCountElement.nextSibling;
        curiosaToolbox.removeCardBtn = cardCountElement.previousSibling;

        // Quick add a copy of the selected card (must have filters to see the +/- buttons
        if ((e.key == 'Enter' && e.shiftKey == true && searchField && searchFieldHasFocus) ||
            (e.key == '=' && e.altKey == true && searchField && searchFieldHasFocus)) {
            if (searchField.value > '') {
                addSelectedCard();
            }
            e.preventDefault();
        }

        // Quick remove a copy of the selected card (must have filters to see the +/- buttons
        if (e.key == '-' && e.altKey == true && searchField && searchFieldHasFocus) {
            if (searchField.value > '') {
                removeSelectedCard();
            }
            e.preventDefault();
        }

    });
})();
