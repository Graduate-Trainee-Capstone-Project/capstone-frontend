import type {ReactNode} from "react";
import {SiteHeader} from "@/app/_components/marketing/SiteHeader";
import {SiteFooter} from "@/app/_components/marketing/SiteFooter";

export default function AppLayout({children}: {children: ReactNode}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
