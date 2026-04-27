import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { post } from "../../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await post("/auth/login/admin", { email, password });
      login(data);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf7] px-6 py-16 text-[#163832] md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2d9b7d]">
            Admin Access
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Review stores and manage platform approvals
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Admins verify medical store registrations, review license details,
            approve trusted shops, and monitor the overall health of the
            MedHunter platform.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Admin responsibilities</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Review uploaded license and identity documents</li>
              <li>Approve or reject new shop registrations</li>
              <li>Suspend shops or cancel approvals when needed</li>
              <li>Track approved, pending, and flagged stores</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f6f5b]">
            Login Form
          </p>
          <h2 className="mt-3 text-3xl font-bold">Administrator Login</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use your admin credentials to continue to the management dashboard.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none transition focus:border-[#1f6f5b]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none transition focus:border-[#1f6f5b]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#1f6f5b] px-4 py-3 font-semibold text-white transition hover:bg-[#185847] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <Link to="/login" className="hover:text-[#1f6f5b]">
              Back to role selection
            </Link>
            <span>Restricted access only</span>
          </div>
        </div>
      </div>
    </main>
  );
}
