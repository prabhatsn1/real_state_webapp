"use client";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import Link from "next/link";
import type { Footer as FooterType, Brand } from "@/types/schema";

interface FooterProps {
  footer: FooterType;
  brand: Brand;
}

const socialIconMap: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
};

export default function Footer({ footer, brand }: FooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "rgba(255,255,255,0.75)",
        pt: { xs: 6, md: 10 },
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* Brand column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "white",
                mb: 1.5,
              }}
            >
              {brand.name}
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.6)", mb: 2, maxWidth: 280 }}
            >
              {brand.tagline} — premium real estate experiences since 1999.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
            >
              {brand.phone}
              <br />
              {brand.email}
              <br />
              {brand.address}
            </Typography>
          </Grid>

          {/* Quick links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="overline"
              sx={{ color: "secondary.main", display: "block", mb: 2 }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {footer.quickLinks.map((item) => (
                <MuiLink
                  key={item.href}
                  component={Link}
                  href={item.href}
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.875rem",
                    "&:hover": { color: "secondary.main" },
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Legal links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography
              variant="overline"
              sx={{ color: "secondary.main", display: "block", mb: 2 }}
            >
              Legal
            </Typography>
            <Stack spacing={1}>
              {footer.legal.map((item) => (
                <MuiLink
                  key={item.href}
                  component={Link}
                  href={item.href}
                  underline="none"
                  sx={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.875rem",
                    "&:hover": { color: "secondary.main" },
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Social */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="overline"
              sx={{ color: "secondary.main", display: "block", mb: 2 }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {footer.social.map((s) => {
                const Icon = (socialIconMap[s.platform] ??
                  InstagramIcon) as React.ComponentType<{ fontSize?: "small" }>;
                return (
                  <IconButton
                    key={s.platform}
                    component="a"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    aria-label={`Follow us on ${s.platform}`}
                    sx={{
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      "&:hover": {
                        color: "secondary.main",
                        borderColor: "secondary.main",
                        bgcolor: "rgba(201,168,76,0.1)",
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                );
              })}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 4 }} />

        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.4)",
            display: "block",
            textAlign: "center",
          }}
        >
          {footer.copyright}
        </Typography>
      </Container>
    </Box>
  );
}
