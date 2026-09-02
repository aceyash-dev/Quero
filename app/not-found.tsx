import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <section className="px-6 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-neutral-500">
          Quero.
        </p>

        <h1 className="text-8xl font-medium tracking-tight sm:text-9xl">
          404
        </h1>

        <p className="mt-6 text-sm text-neutral-400">
          This curiosity led nowhere.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex border border-white/20 px-5 py-3 text-sm transition-colors hover:bg-white hover:text-black"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}