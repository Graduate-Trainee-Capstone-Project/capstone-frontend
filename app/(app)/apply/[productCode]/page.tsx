import Link from "next/link";
import { ApplyProductClient } from "@/app/_components/onboarding/ApplyProductClient";
import { ROUTES } from "@/app/_constants";
import type { ProductCode } from "@/app/_types";

export default async function ApplyProductPage({
  params,
}: {
  params: Promise<{ productCode: string }>;
}) {
  const { productCode } = await params;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-12 sm:px-6">
      <Link href={ROUTES.home} className="text-sm font-medium text-grey-500 hover:text-grey-800">
        &larr; Back to products
      </Link>
      <div className="rounded-2xl border border-grey-200 bg-white p-6 sm:p-8">
        <ApplyProductClient productCode={productCode as ProductCode} />
      </div>
    </div>
  );
}
