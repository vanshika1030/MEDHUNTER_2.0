import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Scanner from "./Scanner";
import Inventory from "./Inventory";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
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
  const navigate = useNavigate();
  const scanningRef = useRef(false); 

  const handleScan = async (barcode) => {
    if (scanningRef.current) return;
    scanningRef.current = true;

    try {
      const res = await fetch("http://localhost:5000/scan-barcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ barcode })
      });

      const data = await res.json();

      if (!data.found) {
        navigate(`/inventory?barcode=${barcode}`);
      } else {
        alert("Medicine added to inventory");
      }

    } catch (err) {
      console.error(err);
      scanningRef.current = false; 
    }
  };

  return <Scanner onScan={handleScan} />;//used by scanner.js as a fun passed as a prop
}
export default App;