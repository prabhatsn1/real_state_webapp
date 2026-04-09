"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { loadAdminStore, saveAdminStore } from "@/lib/adminStore";
import type { AdminStore } from "@/lib/adminStore";
import type { Listing } from "@/types/schema";
import {
  getAdminData,
  upsertListingAction,
  deleteListingAction,
  updateFeaturedListingsAction,
} from "@/lib/actions/admin";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const LISTING_TYPES = [
  "condo",
  "loft",
  "apartment",
  "house",
  "commercial",
] as const;
const LISTING_STATUSES = ["for-sale", "for-rent", "for-lease", "sold"] as const;
const NEW_LISTING_DRAFT_ID = "new-draft";

const STATUS_COLOR: Record<string, "success" | "info" | "warning" | "default"> =
  {
    "for-sale": "success",
    "for-rent": "info",
    "for-lease": "warning",
    sold: "default",
  };

function emptyListing(): Omit<Listing, "id"> {
  return {
    title: "",
    slug: "",
    type: "condo",
    status: "for-sale",
    price: 0,
    location: { city: "", neighbourhood: "", address: "", lat: 0, lng: 0 },
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    areaUnit: "sqft",
    yearBuilt: new Date().getFullYear(),
    description: "",
    features: [],
    images: [],
    agentId: "",
    featured: false,
  };
}

interface EditDialogProps {
  open: boolean;
  listing: Listing | null;
  agentOptions: { id: string; name: string }[];
  onClose: () => void;
  onSave: (listing: Listing) => Promise<void> | void;
}

function EditDialog({
  open,
  listing,
  agentOptions,
  onClose,
  onSave,
}: EditDialogProps) {
  const isNew = !listing?.id || listing.id.startsWith("new-");
  const [form, setForm] = useState<Listing>(
    () =>
      listing ?? ({ id: NEW_LISTING_DRAFT_ID, ...emptyListing() } as Listing),
  );

  const set = (field: keyof Listing, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setLocation = (field: keyof Listing["location"], value: unknown) =>
    setForm((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>{isNew ? "Add New Listing" : "Edit Listing"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {/* Basic info */}
          <Typography variant="subtitle2" color="text.secondary">
            Basic Info
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => {
                set("title", e.target.value);
                set(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, ""),
                );
              }}
              fullWidth
              required
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) => set("type", e.target.value)}
              >
                {LISTING_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={form.status}
                label="Status"
                onChange={(e) => set("status", e.target.value)}
              >
                {LISTING_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Price ($)"
              type="number"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Assigned Agent</InputLabel>
              <Select
                value={form.agentId}
                label="Assigned Agent"
                onChange={(e) => set("agentId", e.target.value)}
              >
                {agentOptions.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Divider />
          {/* Location */}
          <Typography variant="subtitle2" color="text.secondary">
            Location
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Address"
              value={form.location.address}
              onChange={(e) => setLocation("address", e.target.value)}
              fullWidth
            />
            <TextField
              label="Neighbourhood"
              value={form.location.neighbourhood}
              onChange={(e) => setLocation("neighbourhood", e.target.value)}
              fullWidth
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="City"
              value={form.location.city}
              onChange={(e) => setLocation("city", e.target.value)}
              fullWidth
            />
            <TextField
              label="Lat"
              type="number"
              value={form.location.lat}
              onChange={(e) => setLocation("lat", parseFloat(e.target.value))}
              fullWidth
            />
            <TextField
              label="Lng"
              type="number"
              value={form.location.lng}
              onChange={(e) => setLocation("lng", parseFloat(e.target.value))}
              fullWidth
            />
          </Stack>

          <Divider />
          {/* Property details */}
          <Typography variant="subtitle2" color="text.secondary">
            Property Details
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={(e) => set("bedrooms", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={(e) => set("bathrooms", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Area"
              type="number"
              value={form.area}
              onChange={(e) => set("area", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Unit"
              value={form.areaUnit}
              onChange={(e) => set("areaUnit", e.target.value)}
              fullWidth
            />
            <TextField
              label="Year Built"
              type="number"
              value={form.yearBuilt}
              onChange={(e) => set("yearBuilt", Number(e.target.value))}
              fullWidth
            />
          </Stack>

          <Divider />
          {/* Description */}
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          {/* Features */}
          <TextField
            label="Features (comma-separated)"
            value={form.features.join(", ")}
            onChange={(e) =>
              set(
                "features",
                e.target.value
                  .split(",")
                  .map((f) => f.trim())
                  .filter(Boolean),
              )
            }
            fullWidth
            helperText="e.g. Private Terrace, Chef's Kitchen, Concierge"
          />

          {/* Images */}
          <TextField
            label="Image URLs (one per line)"
            value={form.images.join("\n")}
            onChange={(e) =>
              set(
                "images",
                e.target.value
                  .split("\n")
                  .map((u) => u.trim())
                  .filter(Boolean),
              )
            }
            multiline
            minRows={2}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
            }
            label="Featured listing"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={!form.title || !form.agentId}
        >
          {isNew ? "Add Listing" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminListingsPage() {
  const [store, setStore] = useState<AdminStore | null>(() =>
    IS_MOCK ? loadAdminStore() : null,
  );
  const [editTarget, setEditTarget] = useState<Listing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleEdit = (listing: Listing) => {
    setEditTarget(listing);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditTarget({ id: `new-${Date.now()}`, ...emptyListing() } as Listing);
    setDialogOpen(true);
  };

  const handleSave = async (listing: Listing) => {
    if (!store) return;
    const exists = store.listings.some((l) => l.id === listing.id);
    const updatedListings = exists
      ? store.listings.map((l) => (l.id === listing.id ? listing : l))
      : [...store.listings, listing];

    // Sync featuredListingIds
    const featuredListingIds = updatedListings
      .filter((l) => l.featured)
      .map((l) => l.id);

    persist({ ...store, listings: updatedListings, featuredListingIds });
    setDialogOpen(false);

    if (!IS_MOCK) {
      const [r1, r2] = await Promise.all([
        upsertListingAction(listing),
        updateFeaturedListingsAction(featuredListingIds),
      ]);
      const err = r1.error ?? r2.error;
      if (err) {
        setToast({ msg: err, severity: "error" });
        return;
      }
    }

    setToast({
      msg: exists ? "Listing updated." : "Listing added.",
      severity: "success",
    });
  };

  const handleDelete = async (id: string) => {
    if (!store) return;
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    persist({
      ...store,
      listings: store.listings.filter((l) => l.id !== id),
      featuredListingIds: store.featuredListingIds.filter((fid) => fid !== id),
    });

    if (!IS_MOCK) {
      const { error } = await deleteListingAction(id);
      if (error) {
        setToast({ msg: error, severity: "error" });
        return;
      }
    }

    setToast({ msg: "Listing deleted.", severity: "success" });
  };

  const handleToggleFeatured = async (listing: Listing) => {
    if (!store) return;
    const updated = { ...listing, featured: !listing.featured };
    const updatedListings = store.listings.map((l) =>
      l.id === listing.id ? updated : l,
    );
    const featuredListingIds = updatedListings
      .filter((l) => l.featured)
      .map((l) => l.id);
    persist({ ...store, listings: updatedListings, featuredListingIds });

    if (!IS_MOCK) {
      await Promise.all([
        upsertListingAction(updated),
        updateFeaturedListingsAction(featuredListingIds),
      ]);
    }
  };

  if (!store) return null;

  const agentOptions = store.agents.map((a) => ({ id: a.id, name: a.name }));

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
            Listings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {store.listings.length} properties total
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Listing
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{ "& th": { fontWeight: 700, bgcolor: "grey.50" } }}
              >
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell align="center">Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {store.listings.map((listing) => {
                const agent = store.agents.find(
                  (a) => a.id === listing.agentId,
                );
                return (
                  <TableRow key={listing.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {listing.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={listing.type}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={listing.status.replace(/-/g, " ")}
                        size="small"
                        color={STATUS_COLOR[listing.status] ?? "default"}
                      />
                    </TableCell>
                    <TableCell>${listing.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {listing.location.neighbourhood},{" "}
                        {listing.location.city}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {agent?.name ?? listing.agentId}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip
                        title={
                          listing.featured
                            ? "Remove from featured"
                            : "Add to featured"
                        }
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFeatured(listing)}
                        >
                          {listing.featured ? (
                            <StarIcon
                              fontSize="small"
                              sx={{ color: "warning.main" }}
                            />
                          ) : (
                            <StarBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(listing)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(listing.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <EditDialog
        key={`${editTarget?.id ?? "new"}-${dialogOpen ? "open" : "closed"}`}
        open={dialogOpen}
        listing={editTarget}
        agentOptions={agentOptions}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

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
