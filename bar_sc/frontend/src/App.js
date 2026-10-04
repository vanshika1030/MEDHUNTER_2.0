import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Scanner from "./Scanner";
import Inventory from "./Inventory";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>
          <h1> MedHunter</h1>

          <div style={{ marginTop: "20px" }}>
            <Link to="/">
              <button>Scan Medicine</button>
            </Link>

            <Link to="/inventory">
              <button style={{ marginLeft: "10px" }}>
                View Inventory
              </button>
            </Link>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<ScannerWrapper />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function ScannerWrapper() {
  const handleScan = async (barcode) => {
  const res = await fetch("http://localhost:5000/scan-barcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ barcode })
  });

  const data = await res.json();

  if (!data.found) {
    // ❗ redirect to inventory page with barcode
    window.location.href = `/inventory?barcode=${barcode}`;
  } else {
    alert("Medicine added to inventory");
  }
};

  return <Scanner onScan={handleScan} />;
}

export default App;