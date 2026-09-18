import {SubsidiaryProductsView} from "@/app/_components/onboarding/SubsidiaryProductsView";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Stockbroking products",
};

export default function StockbrokingApplyPage() {
  return <SubsidiaryProductsView slug="stockbroking" />;
}
