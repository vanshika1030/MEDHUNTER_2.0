import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { post } from "../../services/api";

export default function ShopkeeperLogin() {
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
      const data = await post("/auth/login/shop", { email, password });
      login(data);
      navigate("/shopkeeper/dashboard");
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
            Shopkeeper Access
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Manage your medical store with MedHunter
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Log in to upload medicines, update stock, view requests, and track
            sales activity from your dedicated shop dashboard.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">What you can do after login</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Upload available medicines</li>
              <li>Track medicine stock and availability</li>
              <li>View customer requests and app contacts</li>
              <li>Monitor dashboard activity and sales</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f6f5b]">
            Login Form
          </p>
          <h2 className="mt-3 text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your registered details to access your shop account.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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

          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <Link to="/login" className="hover:text-[#1f6f5b]">
              Back to role selection
            </Link>

            <Link to="/register/shopkeeper" className="font-semibold hover:text-[#1f6f5b]">
              New shopkeeper? Register here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
