import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel - The Olfactory Gallery",
  description: "Hidden admin order management panel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  redirect("/admin-login");
}
