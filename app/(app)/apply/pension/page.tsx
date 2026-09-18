import {SubsidiaryProductsView} from "@/app/_components/onboarding/SubsidiaryProductsView";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Pension products",
};

export default function PensionApplyPage() {
  return <SubsidiaryProductsView slug="pension" />;
}
