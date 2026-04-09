"use client";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

const PUBLIC_PATHS = ["/admin/login"];

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) {
    // Login page — no sidebar, no auth check
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.100" }}>
        <AdminSidebar />
        <Box component="main" sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Box>
    </AdminAuthGuard>
  );
}
