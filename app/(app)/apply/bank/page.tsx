import {SubsidiaryProductsView} from "@/app/_components/onboarding/SubsidiaryProductsView";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Bank products",
};

export default function BankApplyPage() {
  return <SubsidiaryProductsView slug="bank" />;
}
