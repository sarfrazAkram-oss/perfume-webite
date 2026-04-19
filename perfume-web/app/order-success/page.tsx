export default function OrderSuccessPage() {
  return (
    <main className="grid min-h-[100dvh] w-full place-items-center bg-[#F6F0E8] px-4 py-8 text-black">
      <section className="mx-auto w-full max-w-2xl rounded-[28px] border border-black/10 bg-white p-8 text-center shadow-[0_16px_34px_rgba(0,0,0,0.08)] sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/45">
          Order Status
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Thank You</h1>
        <p className="mt-5 text-base leading-8 text-black/70">
          Your order has been placed successfully.
        </p>
        <p className="mt-2 text-sm leading-7 text-black/60 sm:text-base">
          Order details will be processed soon. Our team will contact you if any additional
          confirmation is needed.
        </p>
      </section>
    </main>
  );
}
