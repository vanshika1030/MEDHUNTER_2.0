import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
function Inventory() {
    const shopId= "SHOP001";
    const location = useLocation(); 
  const params = new URLSearchParams(location.search);
  const scannedBarcode = params.get("barcode");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
const [form, setForm] = useState({
  name: "",
  barcode: scannedBarcode || "",
  type: "",
  quantity: "",
  price: ""
});
const addMedicine = async () => {
  // Validate required fields
  if (!form.name || !form.name.trim()) {
    alert("Medicine name is required");
    return;
  }

  if (!form.quantity || Number(form.quantity) <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }

  console.log("Adding medicine:", {
    name: form.name.trim(),
    barcode: form.barcode.trim(),
    type: form.type.trim(),
    quantity: Number(form.quantity),
    price: Number(form.price) || 0,
    shopId
  });

  try {
    const res = await fetch("http://localhost:5000/add-medicine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name.trim(),
        barcode: form.barcode.trim(),
        type: form.type.trim(),
        quantity: Number(form.quantity),
        price: Number(form.price) || 0,
        shopId
      })
    });

    const result = await res.json();

    if (!res.ok) {
      alert("Error: " + result.error);
      return;
    }

    alert("Medicine added successfully!");

    // Fetch updated inventory
    const updated = await fetch(`http://localhost:5000/inventory/${shopId}`)
      .then(res => res.json());

    console.log("Updated inventory:", updated);
    setData(updated);

    // Reset form but keep scanned barcode if exists
    setForm({
      name: "",
      barcode: scannedBarcode || "",
      type: "",
      quantity: "",
      price: ""
    });

  } catch (err) {
    console.error("Frontend error:", err);
    alert("Frontend error: " + err.message);
  }
};
 

  useEffect(() => {
    fetch(`http://localhost:5000/inventory/${shopId}`)
      .then(res => res.json())
      .then(setData);
  }, []);
useEffect(() => {
  if (scannedBarcode) {
    setForm(prev => ({
      ...prev,
      barcode: scannedBarcode
    }));
  }
}, [scannedBarcode]);
  const deleteItem = async (id) => {
    await fetch(`http://localhost:5000/delete-inventory/${id}`, {
      method: "DELETE"
    });
    setData(prev => prev.filter(item => item._id !== id));
  };

  const filtered = data.filter(item =>
  item.medicineId?.name?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory Dashboard</h2>
       {scannedBarcode && (
      <p style={{ color: "green" }}>
        Scanned Barcode: {scannedBarcode}
      </p>
    )}
      <input
        placeholder=" Search medicine..."
        onChange={(e) => setSearch(e.target.value)}
        style={searchStyle}
      />
      <div className="card">
        <h3>Add Medicine</h3>

        <div style={formGroup}>
          <label>Name *</label>
          <input
            type="text"
            placeholder="Enter medicine name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label>Barcode</label>
          <input
            type="text"
            placeholder="Barcode"
            value={form.barcode}
            onChange={e => setForm({ ...form, barcode: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label>Type</label>
          <input
            type="text"
            placeholder="Medicine type (e.g., Tablet, Syrup)"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label>Quantity *</label>
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            style={inputStyle}
          />
        </div>

        <div style={formGroup}>
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            style={inputStyle}
          />
        </div>

        <button onClick={addMedicine} style={buttonStyle}>Add Medicine</button>

        {form.name && (
          <div style={previewStyle}>
            <strong>Preview:</strong>
            <p>Name: {form.name}</p>
            <p>Barcode: {form.barcode || "(empty)"}</p>
            <p>Type: {form.type || "(empty)"}</p>
            <p>Quantity: {form.quantity || "0"}</p>
            <p>Price: {form.price || "0"}</p>
          </div>
        )}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(item => (
            <tr key={item._id}>
              <td>{item.medicineId?.name}</td>
              <td>{item.medicineId?.type}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => deleteItem(item._id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const searchStyle = {
  padding: "10px",
  width: "250px",
  marginBottom: "20px"
};

const formGroup = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column"
};

const inputStyle = {
  padding: "8px 10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "14px",
  fontFamily: "inherit",
  marginTop: "5px"
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "10px"
};

const previewStyle = {
  backgroundColor: "#f0f0f0",
  padding: "10px",
  borderRadius: "4px",
  marginTop: "15px",
  fontSize: "12px",
  border: "1px solid #ddd"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

export default Inventory;