(function() {
    /**
     * Check and set a global guard variable
     * This makes the content script only do something after the first injection
     */
    if(window.hasRun){
        return;
    }
    window.hasRun = true;

    /**
     * Given a URL to a spooky image, remove all existing images,
     * then create and style and IMG node pointing to 
     * that image, then insert the node into the document.
     */
    function insertImage(imageURL){
        removeExistingImages();
        let spookyImage =  document.createElement("img");
        spookyImage.setAttribute("src", imageURL);
        spookyImage.style.height = "50vh";
        spookyImage.className = "spooky-image";
        document.body.appendChild(spookyImage);
    }

    /**
     * Remove all spooky images from the page
     */
    function removeExistingImages() {
        let existingImages =  document.querySelectorAll(".spooky-image");
        for (let image of existingImages) {
            image.remove()
        }
    }

    /**
     * Listen for messages from the background script
     * Call spookify() or reset()
     */
    broswer.runtime.onMessage.addListener((message) => {
        if (message.command === "spookify") {
            insertImage(message.imageURL);
        }
        else if (message.command === "reset") {
            removeExistingImages();
        }
    });

})();