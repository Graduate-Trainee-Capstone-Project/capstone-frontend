import type {Metadata} from "next";
import {DM_Sans} from "next/font/google";
import "./_styles/globals.css";
import {QueryProvider} from "@/app/_providers/QueryProvider";
import {ToastProvider} from "@/app/_providers/ToastProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Stanbic IBTC | Digital Onboarding",
    template: "%s | Stanbic IBTC",
  },
  description:
    "Open a Bank, Pension, Stockbroking, or Investment account with Stanbic IBTC — one digital onboarding flow across Holdings.",
};

export default function RootLayout({children}: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
