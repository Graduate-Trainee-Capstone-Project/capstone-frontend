import {ProductGrid} from "@/app/_components/onboarding/ProductGrid";

export default function ApplyPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-grey-900">Open a new account</h1>
        <p className="text-sm text-grey-600">
          Choose a product to get started. If you already have a relationship with us, we&apos;ll find your
          details automatically.
        </p>
      </div>
      <ProductGrid />
    </div>
  );
}
