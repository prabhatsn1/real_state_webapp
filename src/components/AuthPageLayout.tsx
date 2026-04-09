"use client";
import { motion } from "framer-motion";
import { Box, Typography, Stack, Divider } from "@mui/material";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import StarRateIcon from "@mui/icons-material/StarRate";
import GroupsIcon from "@mui/icons-material/Groups";

const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = "easeInOut" as const;

interface AuthPageLayoutProps {
  mode: "login" | "signup";
}

const stats = [
  { Icon: HomeWorkIcon, value: "2,400+", label: "Properties Sold" },
  { Icon: StarRateIcon, value: "98%", label: "Client Satisfaction" },
  { Icon: GroupsIcon, value: "15 yrs", label: "Of Excellence" },
];

/* ── Decorative animated building silhouettes ── */
const buildings = [
  { w: 40, h: 120, x: "8%", delay: 0 },
  { w: 28, h: 80, x: "14%", delay: 0.1 },
  { w: 55, h: 160, x: "22%", delay: 0.2 },
  { w: 35, h: 100, x: "32%", delay: 0.15 },
  { w: 50, h: 200, x: "41%", delay: 0.05 },
  { w: 30, h: 90, x: "50%", delay: 0.25 },
  { w: 60, h: 140, x: "58%", delay: 0.1 },
  { w: 25, h: 70, x: "66%", delay: 0.3 },
  { w: 45, h: 180, x: "73%", delay: 0 },
  { w: 32, h: 110, x: "81%", delay: 0.2 },
  { w: 48, h: 130, x: "88%", delay: 0.1 },
];

const panelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_SMOOTH },
  },
};

const formPanelVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: EASE_SMOOTH },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_SMOOTH },
  },
};

const floatAnim = {
  y: [0, -10, 0],
  transition: { duration: 5, repeat: Infinity, ease: EASE_IN_OUT },
};

export default function AuthPageLayout({ mode }: AuthPageLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* ── Left branding panel ── */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        style={{ flex: "0 0 auto" }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 480, lg: 560 },
            minHeight: { xs: 260, md: "100vh" },
            background:
              "linear-gradient(160deg, #0f0f1e 0%, #1a1a2e 50%, #22224a 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 4, md: 7 },
            py: { xs: 6, md: 10 },
            pt: { xs: 12, md: 10 },
          }}
        >
          {/* Skyline silhouette */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: { xs: 100, md: 180 },
              pointerEvents: "none",
            }}
          >
            {buildings.map((b, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.06, 0.13, 0.06] }}
                transition={{
                  duration: 4 + i * 0.4,
                  repeat: Infinity,
                  ease: EASE_IN_OUT,
                  delay: b.delay,
                }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: b.x,
                  width: b.w,
                  height: b.h,
                  background: "rgba(201,168,76,1)",
                  borderRadius: "2px 2px 0 0",
                }}
              />
            ))}
          </Box>

          {/* Floating gold circle accent */}
          <motion.div
            animate={floatAnim}
            style={{
              position: "absolute",
              top: "12%",
              right: "-60px",
              width: 220,
              height: 220,
              borderRadius: "50%",
              border: "1px solid rgba(201,168,76,0.15)",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{
              ...floatAnim,
              transition: { ...floatAnim.transition, delay: 1.5 },
            }}
            style={{
              position: "absolute",
              top: "18%",
              right: "-20px",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "1px solid rgba(201,168,76,0.1)",
              pointerEvents: "none",
            }}
          />

          {/* Gold grid dots */}
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: 40,
              width: 120,
              height: 120,
              opacity: 0.07,
              backgroundImage:
                "radial-gradient(circle, #c9a84c 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Logo */}
            <motion.div variants={fadeUpItem}>
              <Box
                component={Link}
                href="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  textDecoration: "none",
                  mb: { xs: 4, md: 6 },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #c9a84c, #e0c27a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#1a1a2e",
                    flexShrink: 0,
                  }}
                >
                  P
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "white",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Prestige Realty
                </Typography>
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUpItem}>
              <Typography
                variant="overline"
                sx={{
                  color: "secondary.main",
                  display: "block",
                  mb: 1.5,
                  letterSpacing: 3,
                }}
              >
                {mode === "login" ? "Welcome Back" : "Join Us Today"}
              </Typography>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: { xs: "1.8rem", md: "2.4rem" },
                  lineHeight: 1.2,
                  color: "white",
                  mb: 2,
                }}
              >
                {mode === "login"
                  ? "Your Next Home Awaits"
                  : "Find Where You Belong"}
              </Typography>
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  mb: { xs: 4, md: 6 },
                  maxWidth: 340,
                }}
              >
                {mode === "login"
                  ? "Access your saved properties, track enquiries, and continue your journey with New York's premier real estate agency."
                  : "Create an account to save favourite listings, message agents directly, and get personalised property recommendations."}
              </Typography>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUpItem}>
              <Divider sx={{ borderColor: "rgba(201,168,76,0.2)", mb: 3 }} />
              <Stack
                direction={{ xs: "row", md: "column" }}
                spacing={{ xs: 3, md: 2.5 }}
                flexWrap="wrap"
              >
                {stats.map(({ Icon, value, label }) => (
                  <Box
                    key={label}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        bgcolor: "rgba(201,168,76,0.12)",
                        border: "1px solid rgba(201,168,76,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 18, color: "secondary.main" }} />
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "white",
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "rgba(255,255,255,0.45)",
                          lineHeight: 1.2,
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </motion.div>
        </Box>
      </motion.div>

      {/* ── Right form panel ── */}
      <motion.div
        variants={formPanelVariants}
        initial="hidden"
        animate="visible"
        style={{ flex: 1, display: "flex" }}
      >
        <Box
          sx={{
            flex: 1,
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 6, md: 8 },
            py: { xs: 6, md: 10 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 420 }}>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35,
                duration: 0.6,
                ease: EASE_SMOOTH,
              }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                fontFamily='"Playfair Display", Georgia, serif'
                mb={0.75}
              >
                {mode === "login" ? "Sign in" : "Create account"}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Box
                  component={Link}
                  href={mode === "login" ? "/signup" : "/login"}
                  sx={{
                    color: "secondary.dark",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {mode === "login" ? "Sign up free →" : "Sign in →"}
                </Box>
              </Typography>
            </motion.div>

            {/* Gold accent line */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
                ease: EASE_SMOOTH,
              }}
            >
              <Box
                sx={{
                  height: 3,
                  width: 48,
                  bgcolor: "secondary.main",
                  borderRadius: 2,
                  mb: 4,
                }}
              />
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.45,
                duration: 0.6,
                ease: EASE_SMOOTH,
              }}
            >
              <AuthForm mode={mode} />
            </motion.div>

            {/* Footer note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <Typography
                variant="caption"
                color="text.disabled"
                display="block"
                textAlign="center"
                mt={4}
              >
                By continuing you agree to our{" "}
                <Box
                  component={Link}
                  href="/terms"
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Terms
                </Box>{" "}
                and{" "}
                <Box
                  component={Link}
                  href="/privacy"
                  sx={{
                    color: "text.secondary",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Privacy Policy
                </Box>
                .
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
