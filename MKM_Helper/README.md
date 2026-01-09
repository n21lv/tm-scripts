# What is this?
This is a [Userscript](https://en.wikipedia.org/wiki/Userscript) that aims to make your life a bit easier when using Cardmarket (MKM) by adding some really cool quality-of-life improvements. 
## Features
* Toggle for auto-hiding "restricted" articles (ones that have the cart button disabled). Enabled by default
* One-click search for any card from /Cards, /Singles, /Wants, and /ShoppingCart pages (MKM limits the results to 2 months, though)
* One-click search results navigation (2 months back and forth)
* Approximate total price for Wants lists (using buy prices you set)
* One-click copying of the Wants list to clipboard
* One-click copying of order contents to clipboard

# How do I install this?
## On PC
1. Install the [Tampermonkey](https://www.tampermonkey.net) extension. This [video guide](https://www.tampermonkey.net/faq.php#Q100) will explain the details if you're unsure how to do this
2. Once installed, [make sure you actually enable the possibility to execute userscripts](https://www.tampermonkey.net/faq.php#Q209)
3. Open the [userscript file](mkm_helper.user.js) and click the "Raw" button. This will cause a Tampermonkey prompt asking about the userscript installation
4. Click "Install", and you're done!

## On Android
1. As of writing this, only Microsoft Edge supports installing extensions, so you would first need to install the [Edge browser](https://play.google.com/store/apps/details?id=com.microsoft.emmx) from Play Market
2. After installing Edge, open the menu by tapping the three horizontal lines icon in the bottom right corner
3. Tap the "Extensions" option
4. Find the Tampermonkey extension and tap the "Get" button. You will see a prompt asking you about installing the extension
5. Check the checkbox saying `You need to enable "Allow User Scripts" option to use this extension` to enable the "Add" button
6. Tap the "Add" button
7. Using Edge browser, go to https://github.com/n21lv/tm-scripts (this repository)
8. Open the "MKM_Helper" folder. You will see this readme
9. Open the [mkm_helper.user.js](mkm_helper.user.js) file
10. Tap the three dots button right above the code. It will show a small menu titled "Raw file contents"
11. Tap the "View" button. This will cause a Tampermonkey prompt asking about the userscript installation
12. Tap "Install", and you're done!

# FAQ
## Will this work on iOS/my Apple mobile device?
Honestly, I have no idea as I do not own any Apple devices, but Tampermonkey does support the Safari browser and Edge does have an iOS version, so I would assume it might work. Please let me know if it actually works, and I will try adding an installation instruction for iOS
