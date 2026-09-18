"use client";

import type {Product} from "@/app/_types";
import {PRODUCT_DISPLAY_COPY, productDisplayName} from "@/app/_constants";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 shrink-0 text-primary-500"
      aria-hidden
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  );
}

export function ProductCard({product, onSelect}: ProductCardProps) {
  const copy = PRODUCT_DISPLAY_COPY[product.productCode];
  const name = productDisplayName(product.productCode, product.productName);

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-grey-200 bg-white p-6 text-left cursor-pointer shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-500/10 text-sm font-bold text-primary-500">
          {name.slice(0, 1)}
        </span>
        <span className="rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold text-primary-900">
          Apply online
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-tight text-primary-900">{name}</h3>
        <p className="text-sm leading-relaxed text-grey-600">{copy?.description}</p>
      </div>

      {copy?.benefits ? (
        <ul className="flex w-full flex-col gap-2">
          {copy.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-xs text-primary-900">
              <CheckIcon />
              {benefit}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-auto flex w-full flex-wrap gap-1.5">
        {product.requiredIdentifiers.map((identifier) => (
          <span
            key={identifier}
            className="rounded-md bg-primary-100/10 px-2 py-0.5 text-xs font-medium text-primary-400"
          >
            {identifier} required
          </span>
        ))}
      </div>

      <span className="text-sm font-semibold text-primary-500 group-hover:underline">
        Get started &rarr;
      </span>
    </button>
  );
}
