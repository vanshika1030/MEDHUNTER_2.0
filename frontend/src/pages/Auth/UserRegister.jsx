import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../services/api";

export default function UserRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const data = await post("/auth/register/user", { email, password });
      setSuccess(data.message || "Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login/user"), 1500);
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
            New User
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Create your MedHunter account
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Register to start finding medicines at nearby medical stores.
            Compare prices, check availability, and get route directions — all
            in one place.
          </p>

          <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">After registration you can</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Search medicines by name in your area</li>
              <li>View nearby stores with real-time stock</li>
              <li>Compare distances and prices</li>
              <li>Get shop contact and route details</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f6f5b]">
            Registration Form
          </p>
          <h2 className="mt-3 text-3xl font-bold">Get started</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email and create a password to register.
          </p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-2xl bg-[#dff4ea] px-4 py-3 text-sm font-semibold text-[#1f6f5b]">
              {success}
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
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none transition focus:border-[#1f6f5b]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none transition focus:border-[#1f6f5b]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#1f6f5b] px-4 py-3 font-semibold text-white transition hover:bg-[#185847] disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
            <Link to="/login" className="hover:text-[#1f6f5b]">
              Back to role selection
            </Link>
            <Link to="/login/user" className="font-semibold hover:text-[#1f6f5b]">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
