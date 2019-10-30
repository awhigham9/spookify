/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
/**
 * Modified from source code for choose_beast.js found at
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension
 * written by Mozilla Contributors
 * 
 * Script to manage the browser extension menu
 */

 /**
 * CSS to hide everything on the page,
 * except for elements that have the "spooky-image" class.
 */
 const hidePage = `body > :not(.spooky-image) {
     display: none;
 }`;

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {

    /**
     * Given the name of the asset, get the URL corresponding to the image
     */
    function assetNameToURL(name) {
        switch(name) {
            case "Spooky":
                return browser.extension.getURL("assets/skull-trumpet.png");
            case "Spookier":
                return browser.extension.getURL("assets/skeleton-angry.jpg");
            case "Spookiest":
                return broswer.extension.getURL("assets/spookybois.jpg")
        }
    }

    /**
     * Insert page hiding CSS into active tab,
     * then run the content_script spookify with the imageURL
     * obtained from our assetNametoURL function
     */
    function spookify(tabs) {
        browser.tabs.insertCSS({code: hidePage}).then(() => {
            let url = assetNameToURL(e.target.textContent);
            browser.tabs.sendMessage(tabs[0].id, {
                command: "spookify", imageURL: url
            });
        });
    }

    /**
     * 
     */
    function reset(tabs) {
        browser.tabs.removeCSS({code: hidePage}).then(() => {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "reset",
            });
        });
    }

    /**
     * Log an error to the console
     */
    function reportError(error) {
        console.error(`Could not spookify: ${error}`);
    }

    /**
     * Get the active tab, and call spookify() or reset() accordingly
     */
    if (e.target.classList.contains("spooky")) {
        browser.tabs.query({active: true, currentWindow: true})
        .then(spookify)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
        browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
    });
}

    /**
    * There was an error executing the script.
    * Display the popup's error message, and hide the normal UI.
    */
    function reportExecuteScriptError(error) {
        document.querySelector("#popup-content").classList.add("hidden");
        document.querySelector("#error-content").classList.remove("hidden");
        console.error(`Failed to execute spookify content script: ${error.message}`);
    }
        
    /**
    * When the popup loads, inject a content script into the active tab,
    * and add a click handler.
    * If we couldn't inject the script, handle the error.
    */
    browser.tabs.executeScript({file: "/content_scripts/spookify.js"})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);