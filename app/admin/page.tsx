"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";
import { loadAdminStore } from "@/lib/adminStore";
import type { AdminStore } from "@/lib/adminStore";
import { getAdminData } from "@/lib/actions/admin";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>{icon}</Avatar>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

const STATUS_COLOR: Record<
  string,
  "default" | "success" | "warning" | "error" | "info"
> = {
  "for-sale": "success",
  "for-rent": "info",
  "for-lease": "warning",
  sold: "default",
};

export default function AdminDashboardPage() {
  const [store, setStore] = useState<AdminStore | null>(null);

  useEffect(() => {
    if (IS_MOCK) {
      setStore(loadAdminStore());
    } else {
      getAdminData()
        .then(setStore)
        .catch(() => setStore(loadAdminStore()));
    }
  }, []);

  if (!store) return null;

  const totalValue = store.listings
    .filter((l) => l.status !== "sold")
    .reduce((sum, l) => sum + l.price, 0);

  const forSale = store.listings.filter((l) => l.status === "for-sale").length;
  const forRent = store.listings.filter((l) => l.status === "for-rent").length;
  const forLease = store.listings.filter(
    (l) => l.status === "for-lease",
  ).length;
  const sold = store.listings.filter((l) => l.status === "sold").length;
  const featured = store.listings.filter((l) => l.featured).length;

  const recentListings = [...store.listings].slice(0, 5);

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of your real estate portfolio
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Listings"
            value={store.listings.length}
            icon={<HomeWorkIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Agents"
            value={store.agents.length}
            icon={<PeopleIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Featured Listings"
            value={featured}
            icon={<StarIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Portfolio Value"
            value={"$" + (totalValue / 1_000_000).toFixed(1) + "M"}
            icon={<AttachMoneyIcon />}
            color="success.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Status breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              By Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {[
              { label: "For Sale", count: forSale, color: "success" as const },
              { label: "For Rent", count: forRent, color: "info" as const },
              {
                label: "For Lease",
                count: forLease,
                color: "warning" as const,
              },
              { label: "Sold", count: sold, color: "default" as const },
            ].map((row) => (
              <Box
                key={row.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography variant="body2">{row.label}</Typography>
                <Chip label={row.count} size="small" color={row.color} />
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Button
              component={Link}
              href="/admin/listings"
              variant="outlined"
              size="small"
              fullWidth
            >
              Manage Listings
            </Button>
          </Paper>
        </Grid>

        {/* Recent listings */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Recent Listings
              </Typography>
              <Button component={Link} href="/admin/listings" size="small">
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <List dense disablePadding>
              {recentListings.map((listing) => (
                <ListItem
                  key={listing.id}
                  secondaryAction={
                    <Chip
                      label={listing.status}
                      size="small"
                      color={STATUS_COLOR[listing.status] ?? "default"}
                    />
                  }
                  sx={{ px: 0 }}
                >
                  <ListItemText
                    primary={listing.title}
                    secondary={`${listing.location.neighbourhood} · $${listing.price.toLocaleString()}`}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      variant: "body2",
                    }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Agents */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Agents
              </Typography>
              <Button component={Link} href="/admin/agents" size="small">
                Manage Agents
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {store.agents.map((agent) => (
                <Grid key={agent.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={agent.photo}
                      alt={agent.name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {agent.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {agent.title}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
