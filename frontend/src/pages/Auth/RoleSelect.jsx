import { Link } from "react-router-dom";

const roles = [
  {
    title: "User",
    eyebrow: "Medicine search",
    description:
      "Search medicines, compare nearby stores, and follow routes without wasting time moving shop to shop.",
    path: "/login/user",
    buttonText: "Enter User Portal",
  },
  {
    title: "Shopkeeper",
    eyebrow: "Store management",
    description:
      "Upload medicines, manage stock, and respond to local demand from people searching around your area.",
    path: "/login/shopkeeper",
    buttonText: "Open Store Portal",
  },
  {
    title: "Admin",
    eyebrow: "Trust and review",
    description:
      "Approve stores, inspect license submissions, and keep the MedHunter network verified and reliable.",
    path: "/login/admin",
    buttonText: "Open Admin Portal",
  },
];

export default function RoleSelect() {
  return (
    <main className="medhunter-shell relative min-h-screen overflow-hidden px-6 py-12 text-[#163832] md:px-10 lg:px-16">
      <div className="medhunter-mesh" />
      <div className="medhunter-orb medhunter-orb-a" />
      <div className="medhunter-orb medhunter-orb-c" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-white/65 bg-white/58 p-6 shadow-[0_24px_60px_rgba(22,56,50,0.08)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.34em] text-[#2d9b7d]">
                MedHunter access
              </p>
              <h1 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] md:text-6xl">
                Choose the right portal for your role.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Each role is purpose-built: users discover medicine faster,
              shopkeepers manage visibility and stock, and admins protect trust
              across the platform.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {roles.map((role, index) => (
              <article
                key={role.title}
                className={`rounded-[2.2rem] p-6 shadow-[0_18px_44px_rgba(22,56,50,0.08)] transition hover:-translate-y-1 ${
                  index === 1
                    ? "bg-[#163832] text-white"
                    : "border border-white/75 bg-white/72 backdrop-blur"
                }`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-[0.3em] ${
                    index === 1 ? "text-[#7de0bc]" : "text-[#2d9b7d]"
                  }`}
                >
                  {role.eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-black">{role.title}</h2>
                <p
                  className={`mt-5 min-h-[128px] text-sm leading-7 ${
                    index === 1 ? "text-white/78" : "text-slate-600"
                  }`}
                >
                  {role.description}
                </p>
                <Link
                  to={role.path}
                  className={`inline-block rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] transition hover:-translate-y-0.5 ${
                    index === 1
                      ? "bg-white text-[#163832]"
                      : "bg-[#163832] text-white"
                  }`}
                >
                  {role.buttonText}
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[2rem] bg-[#f4faf7]/85 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#2d9b7d]">
                New medical store?
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Register your shop with license details, location, and owner
                information for admin review.
              </p>
            </div>
            <Link
              to="/register/shopkeeper"
              className="rounded-full bg-[#163832] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
            >
              Register Store
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
