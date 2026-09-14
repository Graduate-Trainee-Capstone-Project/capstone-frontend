"use client";

import type {Product} from "@/app/_types";
import {PRODUCT_DISPLAY_COPY} from "@/app/_constants";
import {cn} from "@/app/_utils/cn";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({product, onSelect}: ProductCardProps) {
  const copy = PRODUCT_DISPLAY_COPY[product.productCode];
  const isActive = product.isActive;

  return (
    <button
      type="button"
      disabled={!isActive}
      onClick={() => isActive && onSelect(product)}
      className={cn(
        "group flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all duration-150",
        isActive
          ? "border-grey-200 bg-white cursor-pointer hover:border-primary-100 hover:shadow-md"
          : "border-grey-100 bg-grey-50 cursor-not-allowed opacity-70",
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-grey-900">{product.productName}</h3>
        {!isActive && (
          <span className="shrink-0 rounded-full bg-grey-200 px-2.5 py-1 text-xs font-medium text-grey-600">
            Coming soon
          </span>
        )}
      </div>
      <p className="text-sm text-grey-600">{copy?.description}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {product.requiredIdentifiers.map((identifier) => (
          <span
            key={identifier}
            className="rounded-md bg-primary-100/10 px-2 py-0.5 text-xs font-medium text-primary-400"
          >
            {identifier}
          </span>
        ))}
      </div>
      {isActive && (
        <span className="mt-2 text-sm font-medium text-primary-400 group-hover:underline">
          Get started &rarr;
        </span>
      )}
    </button>
  );
}
