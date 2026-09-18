import {SubsidiaryProductsView} from "@/app/_components/onboarding/SubsidiaryProductsView";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Investment products",
};

export default function InvestmentApplyPage() {
  return <SubsidiaryProductsView slug="investment" />;
}
