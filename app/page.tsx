import AcidSquares from "@/components/AcidSquares";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <AcidSquares
          color1="#111111"
          color2="#444444"
          color3="#ffffff"
          detail="medium"
          speed={0.7}
          mouseInteraction
          grain
        />
      </div>

      <section className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-3 text-sm tracking-[0.3em] uppercase">
            The Ace Base
          </p>

          <h1 className="text-6xl font-semibold tracking-tight">
            Quero
          </h1>

          <p className="mt-4 text-neutral-400">
            Curiosity Answered.
          </p>
        </div>
      </section>
    </main>
  );
}