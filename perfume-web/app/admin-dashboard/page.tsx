import type { Metadata } from "next";
import AdminDashboardPage from "@/components/AdminDashboardPage";

export const metadata: Metadata = {
  title: "Admin Dashboard - The Olfactory Gallery",
  description: "Restricted admin dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminDashboardPage />;
}