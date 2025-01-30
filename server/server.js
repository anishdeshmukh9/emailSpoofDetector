const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Function to check SPF record

const extractSendingIP = (headers) => {
  const receivedHeaders = headers
    .split("\n")
    .filter((line) => line.toLowerCase().startsWith("received:"));
  
  if (receivedHeaders.length === 0) return null;

  const ipv4Match = receivedHeaders[0].match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/); // Match IPv4
  const ipv6Match = receivedHeaders[0].match(/\b([a-fA-F0-9:]+:+[a-fA-F0-9]+)\b/); // Match IPv6

  return ipv4Match ? ipv4Match[0] : (ipv6Match ? ipv6Match[0] : null);
};

// Function to check SPF validity
const checkSPF = (email, sendingIP) => {
  return new Promise((resolve) => {
    const domain = email.split("@").pop(); // Extract domain from email

    dns.resolveTxt(domain, (err, records) => {
      if (err || !records || records.length === 0) {
        return resolve({ spoofed: true, message: "No SPF record found. High risk of spoofing." });
      }

      let highestScore = 0;
      let bestMatch = null;
      let authorizedIP = false;

      records.forEach((recordArray) => {
        const record = recordArray.join("");
        if (record.includes("v=spf1")) {
          let score = 0;

          // Higher weight for valid SPF syntax elements
          if (record.startsWith("v=spf1")) score += 40;
          if (record.includes("all")) score += 20;
          if (record.includes("ip4:")) score += 15;
          if (record.includes("ip6:")) score += 15;
          if (record.includes("include:")) score += 10;

          if (record.includes(sendingIP)) {
            authorizedIP = true; // The sending IP is authorized
          }
          https://check.spamhaus.org/results?query=google.com
          if (score > highestScore) {
            highestScore = score;
            bestMatch = record;
          }
        }
      });

      if (highestScore > 0) {
        if (authorizedIP) {
          return resolve({ spoofed: false, message: "Valid SPF record, IP authorized. Email is genuine.", accuracy: highestScore, record: bestMatch });
        } else {
          return resolve({ spoofed: true, message: "Valid SPF record, but sending IP is NOT authorized! Possible spoofing detected.", accuracy: highestScore, record: bestMatch });
        }
      }

      resolve({ spoofed: true, message: "SPF record missing. High risk of spoofing." });
    });
  });
};

app.post("/check-email", async (req, res) => {
  const { email, headers } = req.body;
  console.log("Ping received. Checking email:", email);

  if (!email || !headers) {
    console.log("Missing email or headers");
    return res.status(400).json({ safe: false, message: "Email and headers are required!" });
  }

  const sendingIP = extractSendingIP(headers);
  console.log("Extracted Sending IP:", sendingIP);

  if (!sendingIP) {
    console.log("Failed to extract sending IP");
    return res.status(400).json({ safe: false, message: "Could not extract sending IP from headers!" });
  }

  try {
    const spfResult = await checkSPF(email, sendingIP);
    console.log("SPF Result:", spfResult);

    return res.json({ 
      safe: !spfResult.spoofed, 
      message: spfResult.message, 
      accuracy: spfResult.accuracy, 
      record: spfResult.record 
    });
  } catch (error) {
    console.error("Error validating email:", error);
    return res.status(500).json({ safe: false, message: "Server error. Try again later." });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
