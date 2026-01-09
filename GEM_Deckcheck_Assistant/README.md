# What is this?
This is a small [Userscript](https://en.wikipedia.org/wiki/Userscript) created based on the code originally written by [Gergo Kakucs](https://github.com/gergokakucs) and slightly adjusted by me to work with Tampermonkey. It is designed to help Flesh and Blood judges with deckchecking by automatically adding checkboxes next to card names, thus greatly increasing the speed and overall efficiency of the process. 

One of its main benefits is that it *completely removes the need for sorting the deck* before performing the deckcheck.

# How do I install this?
## On PC
1. Install the [Tampermonkey](https://www.tampermonkey.net) extension. This [video guide](https://www.tampermonkey.net/faq.php#Q100) will explain the details if you're unsure how to do this
2. Once installed, [make sure you actually enable the possibility to execute userscripts](https://www.tampermonkey.net/faq.php#Q209)
3. Open the [userscript file](gem-decklist-checkboxes.user.js) and click the "Raw" button. This will cause a Tampermonkey prompt asking about the userscript installation
4. Click "Install", and you're done!

## On Android
1. As of writing this, only Microsoft Edge supports installing extensions, so you would first need to install the [Edge browser](https://play.google.com/store/apps/details?id=com.microsoft.emmx) from Play Market
2. After installing Edge, open the menu by tapping the three horizontal lines icon in the bottom right corner
3. Tap the "Extensions" option
4. Find the Tampermonkey extension and tap the "Get" button. You will see a prompt asking you about installing the extension
5. Check the checkbox saying `You need to enable "Allow User Scripts" option to use this extension` to enable the "Add" button
6. Tap the "Add" button
7. Using Edge browser, go to https://github.com/n21lv/tm-scripts (this repository)
8. Open the "GEM_Deckcheck_Assistant" folder. You will see this readme
9. Open the [gem-decklist-checkboxes.user.js](gem-decklist-checkboxes.user.js) file
10. Tap the three dots button right above the code. It will show a small menu titled "Raw file contents"
11. Tap the "View" button. This will cause a Tampermonkey prompt asking about the userscript installation
12. Tap "Install", and you're done!

# How do I use this?
1. Open a submitted decklist in GEM
2. Click on Print at the top left (under Deck Details)
3. The script will be automatically executed and will add checkboxes next to each card
4. Enjoy!
