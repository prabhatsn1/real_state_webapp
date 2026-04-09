"use client";
import { useState, useCallback } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  Collapse,
  IconButton,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import type { Listing } from "@/types/schema";

interface Filters {
  search: string;
  type: string;
  status: string;
  minBedrooms: number;
  priceRange: [number, number];
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  type: "",
  status: "",
  minBedrooms: 0,
  priceRange: [0, 20_000_000],
  sort: "featured",
};

interface ListingFiltersProps {
  listings: Listing[];
  onFiltered: (results: Listing[]) => void;
}

export default function ListingFilters({
  listings,
  onFiltered,
}: ListingFiltersProps) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [expanded, setExpanded] = useState(false);

  const applyFilters = useCallback(
    (f: Filters) => {
      let result = [...listings];

      if (f.search) {
        const q = f.search.toLowerCase();
        result = result.filter(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.location.city.toLowerCase().includes(q) ||
            l.location.neighbourhood.toLowerCase().includes(q),
        );
      }
      if (f.type) result = result.filter((l) => l.type === f.type);
      if (f.status) result = result.filter((l) => l.status === f.status);
      if (f.minBedrooms > 0)
        result = result.filter((l) => l.bedrooms >= f.minBedrooms);
      result = result.filter(
        (l) => l.price >= f.priceRange[0] && l.price <= f.priceRange[1],
      );

      result.sort((a, b) => {
        if (f.sort === "price-asc") return a.price - b.price;
        if (f.sort === "price-desc") return b.price - a.price;
        if (f.sort === "newest") return b.yearBuilt - a.yearBuilt;
        // featured first
        return Number(b.featured) - Number(a.featured);
      });

      onFiltered(result);
    },
    [listings, onFiltered],
  );

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    applyFilters(next);
  }

  function reset() {
    setFilters(DEFAULT_FILTERS);
    onFiltered(listings);
  }

  const activeCount = [
    filters.search,
    filters.type,
    filters.status,
    filters.minBedrooms > 0 ? "1" : "",
    filters.priceRange[1] < 20_000_000 ? "1" : "",
  ].filter(Boolean).length;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Search + toggle row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: expanded ? 3 : 0,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by city, neighbourhood, or name…"
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          size="small"
          inputProps={{ "aria-label": "Search listings" }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={filters.sort}
            label="Sort by"
            onChange={(e) => update("sort", e.target.value)}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-asc">Price: Low → High</MenuItem>
            <MenuItem value="price-desc">Price: High → Low</MenuItem>
            <MenuItem value="newest">Newest</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          onClick={() => setExpanded((v) => !v)}
          sx={{
            bgcolor: expanded ? "primary.main" : "transparent",
            color: expanded ? "white" : "primary.main",
            border: "1px solid",
            borderColor: expanded ? "primary.main" : "divider",
            borderRadius: 1,
            px: 1.5,
            "&:hover": { bgcolor: "primary.main", color: "white" },
          }}
          aria-label="Toggle filters"
          aria-expanded={expanded}
        >
          <TuneIcon fontSize="small" />
          {activeCount > 0 && (
            <Chip
              label={activeCount}
              size="small"
              color="secondary"
              sx={{ ml: 0.5, height: 16, fontSize: "0.65rem" }}
            />
          )}
        </IconButton>
      </Box>

      {/* Expanded filters */}
      <Collapse in={expanded}>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Property Type</InputLabel>
              <Select
                value={filters.type}
                label="Property Type"
                onChange={(e) => update("type", e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="condo">Condo</MenuItem>
                <MenuItem value="loft">Loft</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => update("status", e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="for-sale">For Sale</MenuItem>
                <MenuItem value="for-rent">For Rent</MenuItem>
                <MenuItem value="for-lease">For Lease</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Min Bedrooms</InputLabel>
              <Select
                value={filters.minBedrooms}
                label="Min Bedrooms"
                onChange={(e) => update("minBedrooms", Number(e.target.value))}
              >
                <MenuItem value={0}>Any</MenuItem>
                <MenuItem value={1}>1+</MenuItem>
                <MenuItem value={2}>2+</MenuItem>
                <MenuItem value={3}>3+</MenuItem>
                <MenuItem value={4}>4+</MenuItem>
                <MenuItem value={5}>5+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Price Range
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, v) => update("priceRange", v as [number, number])}
              min={0}
              max={20_000_000}
              step={50_000}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) =>
                v >= 1_000_000
                  ? `$${(v / 1_000_000).toFixed(1)}M`
                  : `$${(v / 1000).toFixed(0)}K`
              }
              size="small"
              aria-label="Price range"
            />
            <Typography variant="caption" color="text.secondary">
              Up to ${(filters.priceRange[1] / 1_000_000).toFixed(1)}M
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="small"
            startIcon={<CloseIcon />}
            onClick={reset}
            color="inherit"
            sx={{ color: "text.secondary" }}
          >
            Clear Filters
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
}
