import { Link } from "react-router-dom";

const activityPills = [
  "Nearby stock",
  "Route preview",
  "Verified shops",
  "Medicine search",
  "Live requests",
];

const featureCards = [
  {
    title: "User",
    text: "Search a medicine, compare nearby stores, and check route plus distance before stepping out.",
  },
  {
    title: "Shopkeeper",
    text: "Upload stock, scan medicine QR labels, and respond to search demand from nearby users.",
  },
  {
    title: "Admin",
    text: "Review licenses, approve trusted stores, and monitor platform quality across areas.",
  },
];

export default function LandingPage() {
  return (
    <main className="medhunter-shell relative min-h-screen overflow-hidden text-[#163832]">
      <div className="medhunter-mesh" />
      <div className="medhunter-orb medhunter-orb-a" />
      <div className="medhunter-orb medhunter-orb-b" />
      <div className="medhunter-orb medhunter-orb-c" />

      <section className="relative z-10 px-6 py-6 md:px-10 lg:px-16">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/60 bg-white/55 px-4 py-3 shadow-[0_16px_40px_rgba(22,56,50,0.08)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#163832] text-sm font-black text-white">
              MH
            </div>
            <div>
              <h1 className="text-xl font-black tracking-[0.08em]">MedHunter</h1>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Search • Track • Connect
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
            <a href="#about" className="transition hover:text-[#163832]">
              About
            </a>
            <a href="#flows" className="transition hover:text-[#163832]">
              Roles
            </a>
            <a href="#contact" className="transition hover:text-[#163832]">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-[#163832] px-4 py-2 text-sm font-semibold text-[#163832] transition hover:-translate-y-0.5 hover:bg-[#163832] hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register/shopkeeper"
              className="rounded-full bg-[#163832] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(22,56,50,0.2)] transition hover:-translate-y-0.5 hover:bg-[#225449]"
            >
              Register Shop
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="relative">
            <div className="mb-6 flex flex-wrap gap-3">
              {activityPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/70 bg-white/65 px-4 py-2 text-sm font-semibold text-[#225449] shadow-[0_10px_24px_rgba(22,56,50,0.06)] backdrop-blur"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#2d9b7d]">
                Healthcare discovery, redesigned
              </p>
              <h2 className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-7xl xl:text-[6.2rem]">
                Find the right medicine
                <span className="block text-[#2d9b7d]">before the search finds you.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
                MedHunter helps users discover nearby medical stores with the
                medicines they need, compare availability, contact the shop,
                and view the route instantly. At the same time, it gives
                shopkeepers and admins clean, focused tools to manage stock and
                approvals.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="rounded-full bg-[#163832] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_18px_36px_rgba(22,56,50,0.2)] transition hover:-translate-y-1 hover:bg-[#225449]"
              >
                Launch Portal
              </Link>
              <Link
                to="/register/shopkeeper"
                className="rounded-full border border-[#163832] bg-white/70 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#163832] backdrop-blur transition hover:-translate-y-1 hover:bg-white"
              >
                Join as Shopkeeper
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[2rem] border border-white/60 bg-white/72 p-5 shadow-[0_18px_38px_rgba(22,56,50,0.08)] backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  Stores covered
                </p>
                <p className="mt-3 text-4xl font-black">120+</p>
              </div>
              <div className="rounded-[2rem] border border-white/60 bg-[#dff4ea]/90 p-5 shadow-[0_18px_38px_rgba(22,56,50,0.08)]">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  Avg. lookup
                </p>
                <p className="mt-3 text-4xl font-black">12s</p>
              </div>
              <div className="rounded-[2rem] border border-white/60 bg-white/72 p-5 shadow-[0_18px_38px_rgba(22,56,50,0.08)] backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  Verified flow
                </p>
                <p className="mt-3 text-4xl font-black">3 Roles</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[640px]">
            <div className="absolute right-0 top-0 w-[92%] rounded-[2.5rem] bg-[#163832] p-7 text-white shadow-[0_30px_80px_rgba(22,56,50,0.26)] medhunter-float-slow">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#7de0bc]">
                    User search
                  </p>
                  <h3 className="mt-3 text-2xl font-black leading-tight">
                    Paracetamol 650 available in nearby stores
                  </h3>
                </div>
                <div className="rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                  Live
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] bg-white/10 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-lg font-bold">CityCare Medical</p>
                    <p className="text-sm text-white/70">1.2 km away</p>
                  </div>
                  <div className="rounded-full bg-[#7de0bc] px-4 py-2 text-sm font-bold text-[#163832]">
                    Available
                  </div>
                </div>

                <div className="grid gap-4 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                      Price
                    </p>
                    <p className="mt-2 text-xl font-black">Rs. 35</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                      Contact
                    </p>
                    <p className="mt-2 text-xl font-black">Call shop</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/55">
                      Route
                    </p>
                    <p className="mt-2 text-xl font-black">Leaflet map</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-[250px] w-[62%] -rotate-6 rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_54px_rgba(22,56,50,0.12)] backdrop-blur medhunter-float-mid">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2d9b7d]">
                Shopkeeper panel
              </p>
              <h3 className="mt-3 text-2xl font-black">Stock updated via QR scan</h3>
              <div className="mt-5 flex items-center justify-between rounded-[1.5rem] bg-[#f4faf7] p-4">
                <div>
                  <p className="text-sm font-bold">Uploaded today</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    18 medicines
                  </p>
                </div>
                <div className="rounded-full bg-[#163832] px-4 py-2 text-sm font-bold text-white">
                  Synced
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-[8%] w-[54%] rotate-6 rounded-[2rem] bg-[#f7b267] p-5 text-[#163832] shadow-[0_20px_56px_rgba(247,178,103,0.28)] medhunter-float-fast">
              <p className="text-sm font-bold uppercase tracking-[0.22em]">
                Admin approval
              </p>
              <h3 className="mt-3 text-2xl font-black">License review in progress</h3>
              <p className="mt-3 text-sm leading-6">
                New shops are reviewed before appearing in the search network.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 px-6 py-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2.75rem] border border-white/65 bg-white/60 p-8 shadow-[0_24px_60px_rgba(22,56,50,0.08)] backdrop-blur md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#2d9b7d]">
                Why it works
              </p>
              <h3 className="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
                One platform, three focused experiences.
              </h3>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              The product is designed so each role sees only what matters:
              users search faster, shopkeepers manage visibility better, and
              admins keep the ecosystem verified and trustworthy.
            </p>
          </div>

          <div id="flows" className="mt-10 grid gap-5 md:grid-cols-3">
            {featureCards.map((card, index) => (
              <article
                key={card.title}
                className={`rounded-[2rem] p-6 shadow-[0_16px_44px_rgba(22,56,50,0.08)] transition hover:-translate-y-1 ${
                  index === 1
                    ? "bg-[#163832] text-white"
                    : "border border-white/70 bg-[#f9fcfa]"
                }`}
              >
                <p
                  className={`text-sm font-bold uppercase tracking-[0.24em] ${
                    index === 1 ? "text-[#7de0bc]" : "text-[#2d9b7d]"
                  }`}
                >
                  {card.title}
                </p>
                <p className="mt-5 text-lg font-semibold leading-8">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative z-10 px-6 pb-16 pt-8 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2.75rem] bg-[#163832] p-8 text-white shadow-[0_30px_80px_rgba(22,56,50,0.22)] md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#7de0bc]">
                Ready to build
              </p>
              <h3 className="mt-4 text-3xl font-black uppercase leading-tight md:text-5xl">
                A cleaner medicine search experience starts here.
              </h3>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/login"
                className="rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#163832] transition hover:-translate-y-1"
              >
                Explore Portal
              </Link>
              <Link
                to="/register/shopkeeper"
                className="rounded-full border border-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-1 hover:bg-white/10"
              >
                Add Your Store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
