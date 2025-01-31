document.addEventListener("DOMContentLoaded", () => {
  function updateHeaders(headers) {
      document.getElementById("headers").value = headers;
  }

  // Listen for header updates from content.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "sendHeaders") {
          updateHeaders(request.headers);
      }
  });

  document.getElementById("copyHeaders").addEventListener("click", () => {
      const headersText = document.getElementById("headers").value;
      navigator.clipboard.writeText(headersText).then(() => {
          document.getElementById("status").textContent = "Headers copied to clipboard!";
      }).catch((err) => {
          document.getElementById("status").textContent = "Failed to copy headers.";
          console.error("Failed to copy headers:", err);
      });
  });

  document.getElementById("requestapi").addEventListener("click", async () => {
      const headersText = document.getElementById("headers").value;

      try {
          const response = await fetch("http://localhost:5000/api/saveHeaders", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ headers: headersText })
          });
          window.location.href = "result.html";

          const result = await response.json();
          document.getElementById("showme").innerText=result.message;

          // Redirect to result page
      } catch (error) {
          console.error("Error sending headers to server:", error);
      }
  });
});
