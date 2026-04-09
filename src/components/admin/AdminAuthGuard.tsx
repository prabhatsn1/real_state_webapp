"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { isAdminLoggedIn } from "@/lib/adminAuth";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = isAdminLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
