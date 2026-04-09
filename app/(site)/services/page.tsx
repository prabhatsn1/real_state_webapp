import type { Metadata } from "next";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { getSiteContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Comprehensive real estate services from residential sales to commercial advisory.",
};

// Server component — no motion imports that are client-only
export default function ServicesPage() {
  const { services } = getSiteContent();

  const iconMap: Record<string, string> = {
    HomeWork: "🏠",
    Apartment: "🏢",
    Business: "📊",
    Assessment: "📈",
    ManageAccounts: "👤",
    AccountBalance: "🏦",
  };

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 12 },
        pb: 10,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography
            variant="overline"
            color="secondary.dark"
            display="block"
            mb={1}
          >
            What We Offer
          </Typography>
          <Typography variant="h2" mb={2}>
            Comprehensive Real Estate Services
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 580, mx: "auto" }}
          >
            From first-time buyers to seasoned investors, our full-service firm
            covers every facet of the real estate journey.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((svc, i) => (
            <Grid key={svc.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "secondary.main",
                    boxShadow: "0 12px 40px rgba(26,26,46,0.12)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Typography
                  sx={{ fontSize: "2.5rem", mb: 2, display: "block" }}
                >
                  {iconMap[svc.icon] ?? "🏡"}
                </Typography>
                <Typography variant="h5" fontWeight={700} mb={1.5}>
                  {svc.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.7}
                >
                  {svc.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box
          sx={{
            mt: 10,
            p: { xs: 4, md: 8 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
            Not sure which service you need?
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}
          >
            Our agents are happy to guide you. Book a free, no-obligation
            consultation.
          </Typography>
          <Box component="a" href="/contact" sx={{ textDecoration: "none" }}>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                px: 5,
                py: 1.5,
                bgcolor: "secondary.main",
                color: "primary.main",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "opacity 0.2s",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Get a Free Consultation
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
