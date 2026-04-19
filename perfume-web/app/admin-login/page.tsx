import type { Metadata } from "next";
import AdminLoginPage from "@/components/AdminLoginPage";

export const metadata: Metadata = {
  title: "Admin Login - The Olfactory Gallery",
  description: "Restricted admin sign-in page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <AdminLoginPage />;
}