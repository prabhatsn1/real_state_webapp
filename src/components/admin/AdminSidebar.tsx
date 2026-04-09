"use client";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/lib/adminAuth";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    label: "Listings",
    href: "/admin/listings",
    icon: <HomeWorkIcon fontSize="small" />,
  },
  {
    label: "Agents",
    href: "/admin/agents",
    icon: <PeopleIcon fontSize="small" />,
  },
  {
    label: "Site Settings",
    href: "/admin/settings",
    icon: <SettingsIcon fontSize="small" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    adminLogout();
    router.replace("/admin/login");
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 220,
        flexShrink: 0,
        bgcolor: "grey.900",
        color: "common.white",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Brand */}
      <Box
        sx={{ px: 3, py: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <Typography
          variant="overline"
          sx={{ color: "secondary.light", display: "block", mb: 0.5 }}
        >
          Admin Panel
        </Typography>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color: "common.white" }}
        >
          Prestige Realty
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ pt: 1, flex: 1 }}>
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                "&.Mui-selected": {
                  bgcolor: "secondary.dark",
                  color: "common.white",
                  "& .MuiListItemIcon-root": { color: "secondary.light" },
                },
                "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "grey.400" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Back to site */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Tooltip title="Open the public site" placement="right">
        <ListItemButton
          component={Link}
          href="/"
          target="_blank"
          sx={{
            px: 3,
            py: 2,
            color: "grey.400",
            "&:hover": { color: "common.white" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
            <OpenInNewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="View Site"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </ListItemButton>
      </Tooltip>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Tooltip title="Sign out of admin panel" placement="right">
        <ListItemButton
          onClick={handleLogout}
          sx={{
            px: 3,
            py: 2,
            color: "error.light",
            "&:hover": { bgcolor: "rgba(255,100,100,0.08)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ variant: "body2" }}
          />
        </ListItemButton>
      </Tooltip>
    </Box>
  );
}
