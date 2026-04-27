import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { get, post, put, del } from "../../services/api";
import BarcodeScanner from "../../components/BarcodeScanner";

export default function ShopkeeperDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    price: "",
    stock: "",
    description: "",
    barcode: "",
  });
  const [addLoading, setAddLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Barcode scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoadingMeds(true);
      const data = await get("/medicines/my");
      setMedicines(data.medicines || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMeds(false);
    }
  };

  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAddLoading(true);

    try {
      const payload = {
        name: addForm.name,
        manufacturer: addForm.manufacturer,
        batchNumber: addForm.batchNumber,
        expiryDate: addForm.expiryDate || undefined,
        price: Number(addForm.price),
        stock: Number(addForm.stock),
        description: addForm.description,
        barcode: addForm.barcode,
      };

      // If barcode is present, use the barcode endpoint for smarter handling
      if (addForm.barcode && addForm.barcode.trim()) {
        const result = await post("/medicines/add-by-barcode", payload);
        setSuccess(result.message || "Medicine added via barcode successfully");
      } else {
        await post("/medicines", payload);
        setSuccess("Medicine added successfully");
      }

      setShowAddForm(false);
      setShowScanner(false);
      setAddForm({
        name: "",
        manufacturer: "",
        batchNumber: "",
        expiryDate: "",
        price: "",
        stock: "",
        description: "",
        barcode: "",
      });
      fetchMedicines();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const startEdit = (medicine) => {
    setEditingId(medicine._id);
    setEditForm({
      name: medicine.name,
      manufacturer: medicine.manufacturer || "",
      batchNumber: medicine.batchNumber || "",
      expiryDate: medicine.expiryDate ? medicine.expiryDate.split("T")[0] : "",
      price: medicine.price,
      stock: medicine.stock,
      description: medicine.description || "",
      barcode: medicine.barcode || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id) => {
    setError("");
    setSuccess("");
    setEditLoading(true);

    try {
      const payload = {
        name: editForm.name,
        manufacturer: editForm.manufacturer,
        batchNumber: editForm.batchNumber,
        expiryDate: editForm.expiryDate || undefined,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        description: editForm.description,
        barcode: editForm.barcode,
      };
      await put(`/medicines/${id}`, payload);
      setSuccess("Medicine updated successfully");
      setEditingId(null);
      fetchMedicines();
    } catch (err) {
      setError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setError("");
    setSuccess("");

    try {
      await del(`/medicines/${id}`);
      setSuccess("Medicine deleted successfully");
      fetchMedicines();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Barcode scan handler
  const handleBarcodeScan = useCallback(
    async (barcodeValue) => {
      const cleanedBarcode = String(barcodeValue || "").trim();
      if (!cleanedBarcode) {
        setError("No barcode value was detected.");
        return;
      }

      // Close scanner FIRST to avoid cleanup conflicts
      setShowScanner(false);
      setError("");
      setSuccess("");
      setScanLoading(true);

      try {
        const data = await post("/medicines/scan-barcode", {
          barcode: cleanedBarcode,
        });

        if (data.found) {
          // Medicine already in shop — increment stock by 1
          const medicine = data.medicine;
          const updateResult = await post("/medicines/add-by-barcode", {
            barcode: cleanedBarcode,
            name: medicine.name,
            stock: 1,
            price: medicine.price,
          });
          setSuccess(
            updateResult.message ||
              `Stock +1 for "${medicine.name}". New stock: ${medicine.stock + 1}`
          );
          fetchMedicines();
        } else {
          // Not found — pre-fill the add form with scanned barcode
          setShowAddForm(true);

          if (data.suggestion) {
            // Medicine found globally — pre-fill details
            setAddForm({
              name: data.suggestion.name || "",
              manufacturer: data.suggestion.manufacturer || "",
              batchNumber: "",
              expiryDate: "",
              price: "",
              stock: "1",
              description: data.suggestion.description || "",
              barcode: data.suggestion.barcode || cleanedBarcode,
            });
            setSuccess(
              data.message ||
                "Medicine found in database. Details pre-filled — add price & stock."
            );
          } else {
            // Completely new — just set barcode
            setAddForm({
              name: "",
              manufacturer: "",
              batchNumber: "",
              expiryDate: "",
              price: "",
              stock: "1",
              description: "",
              barcode: cleanedBarcode,
            });
            setSuccess(
              `Barcode "${cleanedBarcode}" scanned. Fill in the medicine details below.`
            );
          }
        }
      } catch (err) {
        setError(err.message || "Could not process the scanned barcode.");
      } finally {
        setScanLoading(false);
      }
    },
    []
  );

  const totalMeds = medicines.length;
  const lowStockCount = medicines.filter(
    (m) => m.stock > 0 && m.stock < 20
  ).length;

  return (
    <main className="min-h-screen bg-[#f4faf7] px-6 py-8 text-[#163832] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2d9b7d]">
              Shopkeeper Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Manage medicines, stock, and inventory
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome, <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-2xl bg-[#dff4ea] px-4 py-3 text-sm font-semibold text-[#1f6f5b]">
            {success}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Total Medicines
            </p>
            <h2 className="mt-3 text-3xl font-black">{totalMeds}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Low Stock Items
            </p>
            <h2 className="mt-3 text-3xl font-black">{lowStockCount}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Shop ID</p>
            <h2 className="mt-3 text-sm font-semibold break-all text-slate-700">
              {user?.shopId || "N/A"}
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Your Medicines</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Track your listed medicines and available stock.
                </p>
              </div>

              <div className="flex gap-3">
                {/* Scan Barcode Button */}
                <button
                  onClick={() => {
                    setShowScanner(!showScanner);
                    if (!showScanner) setShowAddForm(false);
                  }}
                  className="rounded-full bg-gradient-to-r from-[#f7b267] to-[#f79d65] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-105"
                >
                  {showScanner ? (
                    "Cancel Scan"
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <line x1="6" y1="8" x2="6" y2="16" />
                        <line x1="9" y1="8" x2="9" y2="16" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="15" y1="8" x2="15" y2="16" />
                        <line x1="18" y1="8" x2="18" y2="16" />
                      </svg>
                      Scan Barcode
                    </span>
                  )}
                </button>

                {/* Add Medicine Manually Button */}
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    if (!showAddForm) setShowScanner(false);
                  }}
                  className="rounded-full bg-[#1f6f5b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#185847]"
                >
                  {showAddForm ? "Cancel" : "Add Medicine"}
                </button>
              </div>
            </div>

            {/* Scan loading indicator */}
            {scanLoading && (
              <div className="mt-4 rounded-2xl bg-[#fef6ec] px-4 py-3 text-sm font-semibold text-[#c47a1a] flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing scanned barcode...
              </div>
            )}

            {/* Barcode Scanner */}
            {showScanner && (
              <BarcodeScanner
                onScan={handleBarcodeScan}
                onClose={() => setShowScanner(false)}
              />
            )}

            {/* Add Medicine Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddSubmit}
                className="mt-6 rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] p-5"
              >
                <h3 className="text-lg font-bold">
                  {addForm.barcode
                    ? "Add Medicine (Barcode Scanned)"
                    : "Add New Medicine"}
                </h3>

                {addForm.barcode && (
                  <div className="mt-2 mb-3 rounded-xl bg-[#fef6ec] px-4 py-2.5 text-sm font-medium text-[#c47a1a] flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <line x1="6" y1="8" x2="6" y2="16" />
                      <line x1="9" y1="8" x2="9" y2="16" />
                      <line x1="12" y1="8" x2="12" y2="16" />
                      <line x1="15" y1="8" x2="15" y2="16" />
                      <line x1="18" y1="8" x2="18" y2="16" />
                    </svg>
                    Barcode: {addForm.barcode}
                  </div>
                )}

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    name="name"
                    placeholder="Medicine Name *"
                    value={addForm.name}
                    onChange={handleAddChange}
                    required
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="text"
                    name="manufacturer"
                    placeholder="Manufacturer"
                    value={addForm.manufacturer}
                    onChange={handleAddChange}
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="text"
                    name="batchNumber"
                    placeholder="Batch Number"
                    value={addForm.batchNumber}
                    onChange={handleAddChange}
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="date"
                    name="expiryDate"
                    placeholder="Expiry Date"
                    value={addForm.expiryDate}
                    onChange={handleAddChange}
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price (₹) *"
                    value={addForm.price}
                    onChange={handleAddChange}
                    required
                    min="0"
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock Count *"
                    value={addForm.stock}
                    onChange={handleAddChange}
                    required
                    min="0"
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="text"
                    name="barcode"
                    placeholder="Barcode (optional)"
                    value={addForm.barcode}
                    onChange={handleAddChange}
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={addForm.description}
                    onChange={handleAddChange}
                    className="rounded-2xl border border-[#d7e8e1] bg-white px-4 py-3 outline-none focus:border-[#1f6f5b]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="mt-4 rounded-full bg-[#1f6f5b] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#185847] disabled:opacity-60"
                >
                  {addLoading ? "Adding..." : "Add Medicine"}
                </button>
              </form>
            )}

            {loadingMeds ? (
              <div className="mt-6 rounded-2xl bg-[#f4faf7] py-8 text-center text-sm text-slate-600">
                Loading medicines...
              </div>
            ) : medicines.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-[#f4faf7] py-8 text-center text-sm text-slate-600">
                No medicines added yet. Click "Add Medicine" or "Scan Barcode"
                to get started.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {medicines.map((medicine) => (
                  <div
                    key={medicine._id}
                    className="rounded-3xl border border-[#e4efea] bg-[#fcfefd] p-5"
                  >
                    {editingId === medicine._id ? (
                      <div>
                        <h3 className="mb-3 text-lg font-bold">
                          Edit Medicine
                        </h3>
                        <div className="grid gap-3 md:grid-cols-2">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="text"
                            name="manufacturer"
                            placeholder="Manufacturer"
                            value={editForm.manufacturer}
                            onChange={handleEditChange}
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={editForm.price}
                            onChange={handleEditChange}
                            min="0"
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="number"
                            name="stock"
                            placeholder="Stock"
                            value={editForm.stock}
                            onChange={handleEditChange}
                            min="0"
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="text"
                            name="batchNumber"
                            placeholder="Batch Number"
                            value={editForm.batchNumber}
                            onChange={handleEditChange}
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="date"
                            name="expiryDate"
                            value={editForm.expiryDate}
                            onChange={handleEditChange}
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="text"
                            name="barcode"
                            placeholder="Barcode"
                            value={editForm.barcode}
                            onChange={handleEditChange}
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b]"
                          />
                          <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            className="rounded-xl border border-[#d7e8e1] bg-white px-3 py-2 text-sm outline-none focus:border-[#1f6f5b] md:col-span-2"
                          />
                        </div>
                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={() => handleEditSubmit(medicine._id)}
                            disabled={editLoading}
                            className="rounded-full bg-[#1f6f5b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {editLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg font-bold">{medicine.name}</h3>
                          {medicine.manufacturer && (
                            <p className="mt-1 text-sm text-slate-500">
                              by {medicine.manufacturer}
                            </p>
                          )}
                          <p className="mt-1 text-sm text-slate-600">
                            Price: ₹{medicine.price} | Stock: {medicine.stock}
                          </p>
                          {medicine.barcode && (
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="2"
                                  y="4"
                                  width="20"
                                  height="16"
                                  rx="2"
                                />
                                <line x1="6" y1="8" x2="6" y2="16" />
                                <line x1="9" y1="8" x2="9" y2="16" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="15" y1="8" x2="15" y2="16" />
                                <line x1="18" y1="8" x2="18" y2="16" />
                              </svg>
                              {medicine.barcode}
                            </p>
                          )}
                          {medicine.batchNumber && (
                            <p className="text-sm text-slate-500">
                              Batch: {medicine.batchNumber}
                            </p>
                          )}
                          {medicine.expiryDate && (
                            <p className="text-sm text-slate-500">
                              Expires:{" "}
                              {new Date(
                                medicine.expiryDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-3 md:items-end">
                          <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                              medicine.stock === 0
                                ? "bg-red-50 text-red-600"
                                : medicine.stock < 20
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-[#dff4ea] text-[#1f6f5b]"
                            }`}
                          >
                            {medicine.stock === 0
                              ? "Out of Stock"
                              : medicine.stock < 20
                                ? "Low Stock"
                                : "Available"}
                          </span>

                          <div className="flex gap-3">
                            <button
                              onClick={() => startEdit(medicine)}
                              className="rounded-full border border-[#1f6f5b] px-4 py-2 text-sm font-semibold text-[#1f6f5b] transition hover:bg-[#1f6f5b] hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(medicine._id, medicine.name)
                              }
                              className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
