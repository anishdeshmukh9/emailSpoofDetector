const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Function to check SPF record
const checkSPF = (domain) => {
  return new Promise((resolve) => {
    dns.resolveTxt(domain, (err, records) => {
      if (err || !records) return resolve({ valid: false, message: "No SPF record found." });

      const spfRecord = records.find((record) => record.join("").startsWith("v=spf1"));
      if (spfRecord) {
        resolve({ valid: true, message: "Valid SPF record found." });
      } else {
        resolve({ valid: false, message: "SPF record missing." });
      }
    });
  });
};

// Function to check DKIM record
const checkDKIM = (selector, domain) => {
  return new Promise((resolve) => {
    dns.resolveTxt(`${selector}._domainkey.${domain}`, (err, records) => {
      if (err || !records) return resolve({ valid: false, message: "No DKIM record found." });

      const dkimRecord = records.find((record) => record.join("").includes("v=DKIM1"));
      if (dkimRecord) {
        resolve({ valid: true, message: "Valid DKIM record found." });
      } else {
        resolve({ valid: false, message: "DKIM record missing." });
      }
    });
  });
};

// Function to check DMARC record
const checkDMARC = (domain) => {
  return new Promise((resolve) => {
    dns.resolveTxt(`_dmarc.${domain}`, (err, records) => {
      if (err || !records) return resolve({ valid: false, message: "No DMARC record found." });

      const dmarcRecord = records.find((record) => record.join("").includes("v=DMARC1"));
      if (dmarcRecord) {
        resolve({ valid: true, message: "Valid DMARC record found." });
      } else {
        resolve({ valid: false, message: "DMARC record missing." });
      }
    });
  });
};

// API Endpoint for Email Spoofing Detection
app.post("/check-email", async (req, res) => {
  const { email, headers } = req.body;

  if (!email || !headers) {
    return res.status(400).json({ safe: false, message: "Email and headers are required!" });
  }

  // Extract domain from email
  const domain = email.split("@")[1];
  if (!domain) {
    return res.status(400).json({ safe: false, message: "Invalid email format!" });
  }

  try {
    // Perform SPF, DKIM, and DMARC checks
    const [spfResult, dkimResult, dmarcResult] = await Promise.all([
      checkSPF(domain),
      checkDKIM("default", domain), // 'default' selector is commonly used
      checkDMARC(domain),
    ]);

    // Generate result message
    const results = [spfResult, dkimResult, dmarcResult];
    const failedChecks = results.filter((r) => !r.valid);
    let message = "Email is safe. All security checks passed! ✅";

    if (failedChecks.length > 0) {
      message = `⚠️ Warning! Potential spoofing detected.\n\nIssues:\n${failedChecks.map((r) => r.message).join("\n")}`;
    }

    res.json({ safe: failedChecks.length === 0, message });
  } catch (error) {
    console.error("Error validating email:", error);
    res.status(500).json({ safe: false, message: "Server error. Try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
