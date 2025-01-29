import React, { useState } from "react";
import axios from "axios";

const AcceptData = () => {
  const [headers, setHeaders] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    try {
      const response = await axios.post("http://localhost:5000/check-email", {
        email,
        headers,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4" style={{ backgroundColor: "#f8f9fa" }}>
        <h3 className="text-primary text-center">Email Spoofing Detection</h3>
        <form>
          <div className="mb-3">
            <label className="form-label text-dark">
              Enter Sender's Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g., attacker@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-dark">Paste Email Headers</label>
            <textarea
              className="form-control"
              rows="6"
              placeholder="Paste full email headers here..."
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
            ></textarea>
          </div>
          <button
            type="button"
            className="btn btn-success w-100 mt-3"
            onClick={handleScan}
          >
            Scan with AI Power
          </button>
        </form>
        {result && (
          <div className="card mt-4 p-3 text-center">
            <h5 className={result.safe ? "text-success" : "text-danger"}>
              {result.message}
            </h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptData;
