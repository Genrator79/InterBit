"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import AdminDashboardClient from "./AdminDashboardClient";
import { toast } from "sonner";

const AdminPage = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // wait until user is loaded
    if (user === undefined) return;

    // not logged in → go to login
    if (!user) {
      toast.error("You must be logged in!", { duration: 2000 });
      router.push("/login");
      return;
    }

    // logged in but not admin → go to dashboard
    if (user.role !== "ADMIN") {
      toast.error("Access denied! Redirecting to dashboard.", { duration: 2000 });
      router.push("/dashboard");
      return;
    }
  }, [user, router]);

  // Show loader while fetching user
  if (user === undefined) return <div>Loading...</div>;

  // Hide content while redirecting
  if (!user || user.role !== "ADMIN") return null;

  return <AdminDashboardClient />;
};

export default AdminPage;
