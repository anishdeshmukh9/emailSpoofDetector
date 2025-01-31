// Check if we are on the "Show Original" page
if (window.location.href.includes("view=om")) {
    console.log("On the 'Show Original' page");

    function extractHeaders() {
        const headersElement = document.querySelector("#raw_message_text");

        if (headersElement) {
            console.log("Found headers element");

            // Extract the text content from the headers element
            const headersText = headersElement.innerText;
            console.log("Extracted headers text:", headersText);

            // Optional: Process headers to remove unwanted content
            const formattedHeaders = headersText.split("Content-Type:")[0];
            
            console.log("Formatted headers text:", formattedHeaders);

            // Send the headers to the popup script
            chrome.runtime.sendMessage({
                action: "sendHeaders",
                headers: formattedHeaders
            });
        } else {
            console.error("Headers element not found!");
        }
    }

    // Run `extractHeaders()` every second
    setInterval(extractHeaders, 1000);
} else {
    console.log("Not on the 'Show Original' page");
}
