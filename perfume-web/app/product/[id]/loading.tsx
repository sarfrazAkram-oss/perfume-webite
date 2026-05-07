export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FBF6EF] px-4 py-8 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="h-4 w-28 animate-pulse rounded-full bg-black/10" />
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-sm sm:p-6">
            <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-black/5" />
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-4">
              <div className="h-3 w-24 animate-pulse rounded-full bg-black/10" />
              <div className="h-9 w-3/4 animate-pulse rounded-full bg-black/10" />
              <div className="h-8 w-40 animate-pulse rounded-full bg-black/10" />
              <div className="space-y-3 pt-4">
                <div className="h-24 animate-pulse rounded-2xl bg-black/5" />
                <div className="h-24 animate-pulse rounded-2xl bg-black/5" />
              </div>
              <div className="h-12 animate-pulse rounded-2xl bg-black/10" />
              <div className="h-12 animate-pulse rounded-2xl bg-black/10" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}