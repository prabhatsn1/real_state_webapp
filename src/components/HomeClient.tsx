"use client";
import { useRef, lazy, Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Avatar,
  Rating,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import MotionSection from "@/components/motion/MotionSection";
import ListingCard from "@/components/listings/ListingCard";
import {
  staggerContainer,
  fadeUp,
  scaleIn,
  fadeLeft,
  fadeRight,
} from "@/animations/variants";
import type { SiteContent, Listing } from "@/types/schema";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

interface HomeClientProps {
  content: SiteContent;
  featuredListings: Listing[];
}

export default function HomeClient({
  content,
  featuredListings,
}: HomeClientProps) {
  const { brand, hero, stats, services, testimonials } = content;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll-driven hero transforms
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);

  // Scroll-driven background colour for page
  const bgL = useTransform(
    scrollY,
    [0, 400, 900, 1400],
    ["#1a1a2e", "#f8f6f0", "#ffffff", "#1a1a2e"],
  );

  return (
    <motion.div ref={containerRef} style={{ backgroundColor: bgL }}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>

        {/* Background gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.4) 60%, rgba(26,26,46,0.2) 100%)",
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            position: "relative",
            zIndex: 2,
            width: "100%",
          }}
        >
          <Container maxWidth="lg" sx={{ py: { xs: 12, md: 0 } }}>
            <Box sx={{ maxWidth: 680 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: "secondary.main", display: "block", mb: 2 }}
                >
                  {brand.tagline}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "white",
                    mb: 3,
                    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  {hero.headline}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: 540,
                  }}
                >
                  {hero.subheadline}
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
              >
                <Button
                  component={Link}
                  href={hero.cta.href}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ color: "primary.main", fontWeight: 700 }}
                >
                  {hero.cta.label}
                </Button>
                <Button
                  component={Link}
                  href={hero.ctaSecondary.href}
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "rgba(255,255,255,0.5)",
                    color: "white",
                    "&:hover": { borderColor: "white" },
                  }}
                >
                  {hero.ctaSecondary.label}
                </Button>
              </motion.div>
            </Box>
          </Container>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <Box
              sx={{
                width: 24,
                height: 40,
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: 12,
                display: "flex",
                justifyContent: "center",
                pt: 1,
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 8,
                  borderRadius: 2,
                  bgcolor: "secondary.main",
                }}
              />
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "primary.main", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <Grid container spacing={4} justifyContent="center">
              {stats.map((stat) => (
                <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                  <motion.div
                    variants={scaleIn}
                    style={{ textAlign: "center" }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        color: "secondary.main",
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontWeight: 700,
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {stat.label}
                    </Typography>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "background.default", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <MotionSection variants={fadeUp}>
            <Typography
              variant="overline"
              sx={{ color: "secondary.dark", display: "block", mb: 1 }}
            >
              What We Offer
            </Typography>
            <Typography variant="h2" sx={{ mb: 6, maxWidth: 480 }}>
              Full-Spectrum Real Estate Services
            </Typography>
          </MotionSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <Grid container spacing={3}>
              {services.map((svc) => (
                <Grid key={svc.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <motion.div variants={fadeUp}>
                    <Box
                      sx={{
                        p: 3,
                        height: "100%",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "secondary.main",
                          boxShadow: "0 8px 30px rgba(26,26,46,0.1)",
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h2"
                        component="div"
                        sx={{ fontSize: "2rem", mb: 1.5 }}
                      >
                        {svc.icon === "HomeWork"
                          ? "🏠"
                          : svc.icon === "Apartment"
                            ? "🏢"
                            : svc.icon === "Business"
                              ? "📊"
                              : svc.icon === "Assessment"
                                ? "📈"
                                : svc.icon === "ManageAccounts"
                                  ? "👤"
                                  : "🏦"}
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                        {svc.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {svc.description}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── Featured Listings ──────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "white", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              mb: 6,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <MotionSection variants={fadeLeft}>
              <Typography
                variant="overline"
                sx={{ color: "secondary.dark", display: "block", mb: 1 }}
              >
                Handpicked Properties
              </Typography>
              <Typography variant="h2">Featured Listings</Typography>
            </MotionSection>
            <MotionSection variants={fadeRight}>
              <Button
                component={Link}
                href="/listings"
                variant="outlined"
                color="primary"
              >
                View All →
              </Button>
            </MotionSection>
          </Box>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <Grid container spacing={3}>
              {featuredListings.map((listing) => (
                <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <motion.div variants={fadeUp} style={{ height: "100%" }}>
                    <ListingCard listing={listing} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "primary.main", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <MotionSection variants={fadeUp}>
            <Typography
              variant="overline"
              sx={{ color: "secondary.main", display: "block", mb: 1 }}
            >
              What Clients Say
            </Typography>
            <Typography variant="h2" sx={{ color: "white", mb: 8 }}>
              Stories of Success
            </Typography>
          </MotionSection>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <Grid container spacing={4}>
              {testimonials.map((t) => (
                <Grid key={t.id} size={{ xs: 12, md: 4 }}>
                  <motion.div variants={scaleIn}>
                    <Box
                      sx={{
                        p: 4,
                        bgcolor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 3,
                        height: "100%",
                      }}
                    >
                      <Rating
                        value={t.rating}
                        readOnly
                        size="small"
                        sx={{
                          mb: 2,
                          "& .MuiRating-iconFilled": {
                            color: "secondary.main",
                          },
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255,255,255,0.85)",
                          fontStyle: "italic",
                          mb: 3,
                          lineHeight: 1.8,
                        }}
                      >
                        "{t.quote}"
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={t.avatar}
                          alt={t.author}
                          sx={{ width: 44, height: 44 }}
                        />
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "white", fontWeight: 600 }}
                          >
                            {t.author}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.55)" }}
                          >
                            {t.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background: "linear-gradient(135deg, #c9a84c 0%, #e0c27a 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <MotionSection variants={fadeUp}>
            <Typography variant="h2" sx={{ color: "primary.main", mb: 2 }}>
              Ready to Find Your Dream Home?
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(26,26,46,0.75)", mb: 4 }}
            >
              Our agents are standing by to guide you through every step of the
              journey.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                color="primary"
                size="large"
                sx={{ fontWeight: 700 }}
              >
                Get in Touch
              </Button>
              <Button
                component={Link}
                href="/listings"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontWeight: 600,
                }}
              >
                Browse Properties
              </Button>
            </Box>
          </MotionSection>
        </Container>
      </Box>
    </motion.div>
  );
}
