// ==UserScript==
// @name         FaB Judge Deckchecking Assistant
// @namespace    https://github.com/n21lv/tm-scripts/blob/master/GEM_Deckcheck_Assistant/
// @version      2026-01-09
// @description  Automatically adds checkboxes upon loading a decklist in GEM's print view
// @author       pantokrator (original code) and n21lv (TM port)
// @match        https://gem.fabtcg.com/gem/*/decklists/*/print/
// @icon         https://judge.fabtcg.com/static/Favicon_Judge_Hub.svg
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    [
        "deck-print__equipment-grid",
        "deck-print__main-cards-grid-col deck-print__main-cards-grid-col--1",
        "deck-print__main-cards-grid-col deck-print__main-cards-grid-col--2",
        "deck-print__main-cards-grid-col deck-print__main-cards-grid-col--3",
    ].forEach((selector) => {
        let elementList = document.getElementsByClassName(selector)[0]?.children;
        if (!elementList) {
            throw `Could not find the DOM element using selector ${selector}. The DOM layout might have changed`;
        }

        for (let index = 0; index < elementList.length; index++) {
            const element = elementList[index];
            if (element.children.length == 1 || element.className == "deck-print__card-item deck-print__card-item--total") {
                continue;
            }
            element.children[1].innerHTML += "<br>";
            for (let count = 0; count < Number(element.children[0].innerHTML); count++) {
                element.children[1].innerHTML += "<input type='checkbox'>";
            }
        }
    });

})();
