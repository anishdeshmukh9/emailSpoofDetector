// Check if we are on the "Show Original" page
if (window.location.href.includes("view=om")) {
    console.log("On the 'Show Original' page");

    // Wait for the headers to load
    setTimeout(() => {
        const headersElement = document.querySelector("#raw_message_text");

        if (headersElement) {
            console.log("Found headers element");

            // Extract the text content from the headers element
            const headersText = headersElement.innerText;
            console.log("Extracted headers text:", headersText);

            // Optional: You can split or process headersText here if needed
            const format1 = headersText.split("DOCTYPE")[0];
            console.log("Formatted headers text:", format1);

            // Send the headers to the popup or background script
            chrome.runtime.sendMessage({
                action: "sendHeaders",
                headers: format1
            });
        } else {
            console.error("Headers element not found!");
        }
    }, 1000); // Delay to allow the headers to load
} else {
    console.log("Not on the 'Show Original' page");
}
