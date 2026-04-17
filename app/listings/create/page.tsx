export default function CreateListingPage() {
  return (
    <main className="mx-auto max-w-3xl w-full px-6 py-10">
      <div className="mb-8">
        <div className="clay-label text-warm-silver mb-2">New listing</div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create a Listing
        </h1>
      </div>

      <div className="bg-white border border-oat rounded-3xl p-8 clay-shadow">
        <form className="flex flex-col gap-6">
          <div className="space-y-1.5">
            <label className="clay-label text-warm-charcoal">Title</label>
            <input
              placeholder="What are you offering?"
              className="clay-input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="clay-label text-warm-charcoal">
              Description
            </label>
            <textarea
              placeholder="Describe the item condition, history, etc."
              rows={4}
              className="clay-input resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="clay-label text-warm-charcoal">Price (₺)</label>
            <input
              placeholder="0.00"
              type="number"
              className="clay-input"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="rounded-full border border-oat px-6 py-2.5 text-sm font-medium text-warm-charcoal transition hover:border-clay-black hover:text-clay-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="clay-hover rounded-full bg-clay-black px-6 py-2.5 text-sm font-medium text-white"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}