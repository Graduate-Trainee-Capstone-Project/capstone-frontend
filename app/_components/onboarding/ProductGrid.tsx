"use client";

import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useProducts} from "@/app/_hooks";
import {useOnboardingStore} from "@/app/_hooks/useOnboardingStore";
import {ProductCard} from "@/app/_components/onboarding/ProductCard";
import {Skeleton} from "@/app/_ui/Skeleton";
import {Button} from "@/app/_ui/Button";
import {ROUTES} from "@/app/_constants";
import type {Product} from "@/app/_types";

export function ProductGrid() {
  const router = useRouter();
  const {data, isLoading, isError, refetch, isRefetching} = useProducts();
  const reset = useOnboardingStore((state) => state.reset);

  function handleSelect(product: Product) {
    // Starting a fresh product selection should never carry over a stale
    // draft from a previous product — the identifier screen re-derives
    // everything from /start.
    reset();
    router.push(ROUTES.apply(product.productCode));
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({length: 5}).map((_, index) => (
          <Skeleton key={index} className="h-40" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-grey-200 bg-white p-10 text-center">
        <p className="text-sm text-grey-600">We couldn&apos;t load the product list.</p>
        <Button
          onClick={() => {
            toast.promise(refetch(), {
              loading: "Retrying...",
              success: "Products loaded.",
              error: "Still couldn't reach the server.",
            });
          }}
          isLoading={isRefetching}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.products.map((product) => (
        <ProductCard key={product.productId} product={product} onSelect={handleSelect} />
      ))}
    </div>
  );
}
