"use client";

import type {Product} from "@/app/_types";
import {PRODUCT_DISPLAY_COPY} from "@/app/_constants";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({product, onSelect}: ProductCardProps) {
  const copy = PRODUCT_DISPLAY_COPY[product.productCode];

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-grey-200 bg-white p-5 text-left cursor-pointer transition-all duration-150 hover:border-primary-100 hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-grey-900">{product.productName}</h3>
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
      <span className="mt-2 text-sm font-medium text-primary-400 group-hover:underline">
        Get started &rarr;
      </span>
    </button>
  );
}
