import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-[80vh] overflow-hidden bg-[#F6FAFD] px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#BF1E2E]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[480px] w-[480px] rounded-full bg-[#BF1E2E]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(191,30,46,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <div className="relative mx-auto flex max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-md md:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#BF1E2E]/10 text-[#BF1E2E]">
            <span className="text-2xl font-bold">?</span>
          </div>

          <p className="mt-6 text-center text-sm uppercase tracking-[0.4em] text-[#BF1E2E]">
            404 — Not Found
          </p>
          <h1 className="mt-3 text-center text-4xl font-playfair font-bold text-[#BF1E2E] md:text-5xl">
            This page took a wrong turn
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            The page you’re looking for doesn’t exist, or it may have been moved. Let’s get you back to something
            delicious.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#BF1E2E] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-[#A61926]"
            >
              Go home
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-xl border border-[#BF1E2E]/30 bg-white px-6 py-3 font-semibold text-[#BF1E2E] shadow-sm transition hover:border-[#BF1E2E]/60 hover:bg-[#F6FAFD]"
            >
              View menu
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-gray-700 transition hover:bg-white"
            >
              About us
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#BF1E2E]/60" />
            Tip: check the URL or use the navigation menu.
          </div>
        </div>
      </div>
    </main>
  );
}
