import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postForm } from "../../services/api";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const shopIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 16, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
}

export default function ShopkeeperRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    drugLicenseNumber: "",
    gstNumber: "",
    shopAddress: "",
    latitude: "",
    longitude: "",
  });

  const [licensePhoto, setLicensePhoto] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        alert("Unable to fetch location. Please allow location access.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!licensePhoto) {
      setError("License photo is required");
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError("Please set shop location using the location button");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("shopName", form.shopName);
      formData.append("ownerName", form.ownerName);
      formData.append("email", form.email);
      formData.append("contactNumber", form.contactNumber);
      formData.append("password", form.password);
      formData.append("drugLicenseNumber", form.drugLicenseNumber);
      formData.append("gstNumber", form.gstNumber);
      formData.append("shopAddress", form.shopAddress);
      formData.append("latitude", form.latitude);
      formData.append("longitude", form.longitude);
      formData.append("licensePhoto", licensePhoto);

      const data = await postForm("/auth/register/shop", formData);
      setSuccess(data.message || "Shop registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/login/shopkeeper"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4faf7] px-6 py-12 text-[#163832] md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2d9b7d]">
            Shopkeeper Registration
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Register your medical store on MedHunter
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Submit your shop information, license details, and location so your
            store can be reviewed and approved by the admin.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-3xl rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mx-auto mb-6 max-w-3xl rounded-2xl bg-[#dff4ea] px-4 py-3 text-center text-sm font-semibold text-[#1f6f5b]">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Why register?</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>List your available medicines for nearby users</li>
                <li>Manage stock and medicine uploads</li>
                <li>Track requests and customer contacts</li>
                <li>Access your shop dashboard after approval</li>
              </ul>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Location Preview</h2>
              <p className="mt-3 text-sm text-slate-600">
                {form.latitude && form.longitude
                  ? `Lat: ${form.latitude}, Lng: ${form.longitude}`
                  : "Click \"Use Current Shop Location\" to set your position."}
              </p>

              <div className="mt-5 h-80 overflow-hidden rounded-[2rem] border-2 border-[#cfe4da]">
                <MapContainer
                  center={
                    form.latitude && form.longitude
                      ? [parseFloat(form.latitude), parseFloat(form.longitude)]
                      : [20.5937, 78.9629]
                  }
                  zoom={form.latitude ? 16 : 5}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%", borderRadius: "1.8rem" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater
                    lat={form.latitude ? parseFloat(form.latitude) : null}
                    lng={form.longitude ? parseFloat(form.longitude) : null}
                  />
                  {form.latitude && form.longitude && (
                    <Marker
                      position={[
                        parseFloat(form.latitude),
                        parseFloat(form.longitude),
                      ]}
                      icon={shopIcon}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold text-[#163832]">Your Shop Location</p>
                          <p className="text-xs text-slate-600">
                            {form.latitude}, {form.longitude}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-lg">
            <h2 className="text-3xl font-bold">Registration Form</h2>
            <p className="mt-2 text-sm text-slate-600">
              Fill in the shop and owner details carefully for verification.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <section>
                <h3 className="text-xl font-bold">Shop Details</h3>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      placeholder="Enter shop name"
                      value={form.shopName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      placeholder="Enter owner name"
                      value={form.ownerName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="Enter phone number"
                      value={form.contactNumber}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password (min 6 characters)"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold">License and Identity</h3>
                <div className="mt-4 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Drug License Number
                    </label>
                    <input
                      type="text"
                      name="drugLicenseNumber"
                      placeholder="Enter drug license number"
                      value={form.drugLicenseNumber}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gstNumber"
                      placeholder="Enter GST number"
                      value={form.gstNumber}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold">
                      Upload License Photo
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setLicensePhoto(e.target.files[0])}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 text-sm"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Accepted formats: JPG, JPEG, PNG, PDF
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold">Shop Location</h3>
                <div className="mt-4 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Shop Address
                    </label>
                    <textarea
                      rows="4"
                      name="shopAddress"
                      placeholder="Enter full shop address"
                      value={form.shopAddress}
                      onChange={handleChange}
                      required
                      className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f9fcfb] px-4 py-3 outline-none focus:border-[#1f6f5b]"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={form.latitude}
                        placeholder="Latitude"
                        readOnly
                        className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f1f8f4] px-4 py-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={form.longitude}
                        placeholder="Longitude"
                        readOnly
                        className="w-full rounded-2xl border border-[#d7e8e1] bg-[#f1f8f4] px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="rounded-full bg-[#1f6f5b] px-5 py-3 font-semibold text-white transition hover:bg-[#185847]"
                  >
                    Use Current Shop Location
                  </button>
                </div>
              </section>

              <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
                <Link
                  to="/login/shopkeeper"
                  className="text-sm font-semibold text-slate-600 hover:text-[#1f6f5b]"
                >
                  Already registered? Login here
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-[#1f6f5b] px-8 py-3 font-semibold text-white transition hover:bg-[#185847] disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
