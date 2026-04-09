"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  loadAdminStore,
  saveAdminStore,
  resetAdminStore,
} from "@/lib/adminStore";
import type { AdminStore } from "@/lib/adminStore";
import type { SiteContent } from "@/types/schema";
import { getAdminData, updateSiteSettingsAction } from "@/lib/actions/admin";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default function AdminSettingsPage() {
  const [store, setStore] = useState<AdminStore | null>(() =>
    IS_MOCK ? loadAdminStore() : null,
  );
  const [toast, setToast] = useState<{
    msg: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (IS_MOCK) return;
    getAdminData()
      .then(setStore)
      .catch(() => setStore(loadAdminStore()));
  }, []);

  const persist = useCallback((updated: AdminStore) => {
    setStore(updated);
    if (IS_MOCK) saveAdminStore(updated);
  }, []);

  const setBrand = (field: keyof SiteContent["brand"], value: string) => {
    if (!store) return;
    persist({ ...store, brand: { ...store.brand, [field]: value } });
  };

  const setStat = (index: number, field: "value" | "label", value: string) => {
    if (!store) return;
    const updated = store.stats.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    );
    persist({ ...store, stats: updated });
  };

  const addStat = () => {
    if (!store) return;
    persist({ ...store, stats: [...store.stats, { value: "", label: "" }] });
  };

  const removeStat = (index: number) => {
    if (!store) return;
    persist({ ...store, stats: store.stats.filter((_, i) => i !== index) });
  };

  const handleReset = () => {
    if (!confirm("Reset ALL admin data to defaults? This cannot be undone."))
      return;
    const fresh = resetAdminStore();
    setStore(fresh);
    setToast({ msg: "All data reset to defaults.", severity: "success" });
  };

  const handleSaveAll = async () => {
    if (!store) return;
    if (IS_MOCK) {
      saveAdminStore(store);
    } else {
      const { error } = await updateSiteSettingsAction({
        brand: store.brand,
        stats: store.stats,
        featuredListingIds: store.featuredListingIds,
      });
      if (error) {
        setToast({ msg: error, severity: "error" });
        return;
      }
    }
    setToast({ msg: "Settings saved.", severity: "success" });
  };

  if (!store) return null;

  return (
    <Box sx={{ p: { xs: 3, md: 4 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Site Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit brand info, stats, and featured listings
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Reset everything to original mock data">
            <Button
              variant="outlined"
              color="error"
              startIcon={<RestoreIcon />}
              onClick={handleReset}
            >
              Reset to Defaults
            </Button>
          </Tooltip>
          <Button variant="contained" onClick={handleSaveAll}>
            Save All
          </Button>
        </Stack>
      </Box>

      <Stack spacing={4}>
        {/* Brand Info */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Brand Info
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Agency Name"
                value={store.brand.name}
                onChange={(e) => setBrand("name", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Tagline"
                value={store.brand.tagline}
                onChange={(e) => setBrand("tagline", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                type="email"
                value={store.brand.email}
                onChange={(e) => setBrand("email", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                value={store.brand.phone}
                onChange={(e) => setBrand("phone", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Address"
                value={store.brand.address}
                onChange={(e) => setBrand("address", e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Stats */}
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
              Homepage Stats
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={addStat}>
              Add Stat
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={2}>
            {store.stats.map((stat, i) => (
              <Stack key={i} direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Value"
                  value={stat.value}
                  onChange={(e) => setStat(i, "value", e.target.value)}
                  sx={{ width: 160 }}
                />
                <TextField
                  label="Label"
                  value={stat.label}
                  onChange={(e) => setStat(i, "label", e.target.value)}
                  fullWidth
                />
                <Tooltip title="Remove stat">
                  <IconButton color="error" onClick={() => removeStat(i)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            ))}
          </Stack>
        </Paper>

        {/* Featured Listings */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Featured Listings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Toggle the star ⭐ on the Listings page to feature or un-feature a
            property. Featured listings appear on the homepage.
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {store.featuredListingIds.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
              >
                No featured listings.
              </Typography>
            ) : (
              store.featuredListingIds.map((id) => {
                const listing = store.listings.find((l) => l.id === id);
                return (
                  <Chip
                    key={id}
                    label={listing?.title ?? id}
                    color="warning"
                    variant="outlined"
                    size="small"
                  />
                );
              })
            )}
          </Box>
        </Paper>

        {/* Note */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: "info.50",
            border: "1px solid",
            borderColor: "info.200",
          }}
        >
          <Typography variant="body2" color="info.dark">
            <strong>Note:</strong> This is a demo admin panel backed by{" "}
            <code>localStorage</code>. Changes are stored in your browser and
            will persist across page reloads but not across devices. Use{" "}
            <em>Reset to Defaults</em> to restore the original mock data at any
            time.
          </Typography>
        </Paper>
      </Stack>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.severity}
          variant="filled"
          onClose={() => setToast(null)}
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
