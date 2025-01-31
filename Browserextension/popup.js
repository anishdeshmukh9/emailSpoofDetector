document.addEventListener("DOMContentLoaded", () => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "sendHeaders") {
        document.getElementById("headers").value = request.headers;
      }
    });
  
    document.getElementById("copyHeaders").addEventListener("click", () => {
      const headersText = document.getElementById("headers").value;
      navigator.clipboard.writeText(headersText).then(() => {
        document.getElementById("status").textContent = "Headers copied to clipboard!";
      }).catch((err) => {
        document.getElementById("status").textContent = "Failed tocopy headers.";
        console.error("Failed to copy headers:", err);
      });
    });
  });
  