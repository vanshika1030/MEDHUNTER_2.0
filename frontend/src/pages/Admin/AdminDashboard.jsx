import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { get, put } from "../../services/api";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchShops();
  }, [filter]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError("");
      const query = filter === "all" ? "" : `?status=${filter}`;
      const data = await get(`/admin/shops${query}`);
      setShops(data.shops || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setError("");
    setSuccess("");
    setActionLoading(id);

    try {
      await put(`/admin/shops/${id}/approve`);
      setSuccess("Shop approved successfully");
      fetchShops();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this shop?")) return;

    setError("");
    setSuccess("");
    setActionLoading(id);

    try {
      await put(`/admin/shops/${id}/reject`);
      setSuccess("Shop rejected successfully");
      fetchShops();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const pendingCount = shops.filter((s) => s.status === "pending").length;
  const approvedCount = shops.filter((s) => s.status === "approved").length;
  const rejectedCount = shops.filter((s) => s.status === "rejected").length;

  const filterButtons = [
    { key: "all", label: "All Shops" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const statusColors = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-[#dff4ea] text-[#1f6f5b]",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <main className="min-h-screen bg-[#f4faf7] px-6 py-8 text-[#163832] md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2d9b7d]">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Review medical stores and manage approvals
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

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Total Shops</p>
            <h2 className="mt-3 text-3xl font-black">{shops.length}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Approved Shops
            </p>
            <h2 className="mt-3 text-3xl font-black">{approvedCount}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Pending Review
            </p>
            <h2 className="mt-3 text-3xl font-black">{pendingCount}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Rejected Shops
            </p>
            <h2 className="mt-3 text-3xl font-black">{rejectedCount}</h2>
          </div>
        </div>

        <div className="mt-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">Shop Registrations</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Review store details and manage their status.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filter === btn.key
                        ? "bg-[#1f6f5b] text-white"
                        : "border border-[#d7e8e1] bg-white text-slate-600 hover:border-[#1f6f5b]"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="mt-6 rounded-2xl bg-[#f4faf7] py-8 text-center text-sm text-slate-600">
                Loading shops...
              </div>
            ) : shops.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-[#f4faf7] py-8 text-center text-sm text-slate-600">
                No shops found with the selected filter.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {shops.map((shop) => (
                  <div
                    key={shop._id}
                    className="rounded-3xl border border-[#e4efea] bg-[#fcfefd] p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{shop.shopName}</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Owner: {shop.ownerName}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Email: {shop.email}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Contact: {shop.contactNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Address: {shop.shopAddress}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Drug License: {shop.drugLicenseNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          GST: {shop.gstNumber}
                        </p>
                        {shop.licensePhotoUrl && (
                          <a
                            href={shop.licensePhotoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm font-semibold text-[#1f6f5b] underline"
                          >
                            View License Document
                          </a>
                        )}
                        <p className="mt-2 text-xs text-slate-400">
                          Registered:{" "}
                          {new Date(shop.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <span
                          className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColors[shop.status]}`}
                        >
                          {shop.status}
                        </span>

                        <div className="flex flex-wrap gap-3">
                          {shop.status !== "approved" && (
                            <button
                              onClick={() => handleApprove(shop._id)}
                              disabled={actionLoading === shop._id}
                              className="rounded-full bg-[#1f6f5b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#185847] disabled:opacity-60"
                            >
                              {actionLoading === shop._id
                                ? "Processing..."
                                : "Approve"}
                            </button>
                          )}
                          {shop.status !== "rejected" && (
                            <button
                              onClick={() => handleReject(shop._id)}
                              disabled={actionLoading === shop._id}
                              className="rounded-full bg-[#b94b4b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#a03d3d] disabled:opacity-60"
                            >
                              {actionLoading === shop._id
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
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
