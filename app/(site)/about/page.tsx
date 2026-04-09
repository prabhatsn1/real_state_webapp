import type { Metadata } from "next";
import { Box, Container, Grid, Typography, Divider } from "@mui/material";
import { getSiteContent } from "@/lib/data";
import MotionSection from "@/components/motion/MotionSection";
import { fadeUp, fadeLeft, fadeRight, scaleIn } from "@/animations/variants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Prestige Realty's history, mission, and team.",
};

export default function AboutPage() {
  const { about, stats } = getSiteContent();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero banner */}
      <Box
        sx={{
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <MotionSection as="div" variants={fadeUp}>
            <Typography
              variant="overline"
              sx={{ color: "secondary.main", display: "block", mb: 2 }}
            >
              Our Story
            </Typography>
            <Typography variant="h1" sx={{ color: "white", mb: 3 }}>
              {about.headline}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              {about.body}
            </Typography>
          </MotionSection>
        </Container>
      </Box>

      {/* Stats bar */}
      <Box sx={{ bgcolor: "secondary.main", py: 5 }}>
        <Container maxWidth="lg">
          <MotionSection as="div" variants={fadeUp}>
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat) => (
                <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "primary.main",
                        fontWeight: 700,
                        fontFamily: '"Playfair Display", Georgia, serif',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "primary.light" }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </MotionSection>
        </Container>
      </Box>

      {/* Mission */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
        <Container maxWidth="md">
          <MotionSection as="div" variants={fadeUp}>
            <Typography
              variant="overline"
              color="secondary.dark"
              display="block"
              mb={1}
              textAlign="center"
            >
              Our Mission
            </Typography>
            <Typography variant="h3" textAlign="center" mb={4}>
              Why We Do What We Do
            </Typography>
          </MotionSection>
          <MotionSection as="div" variants={fadeLeft} delay={0.15}>
            <Box
              sx={{
                borderLeft: "4px solid",
                borderColor: "secondary.main",
                pl: 4,
                py: 1,
              }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                fontWeight={400}
                lineHeight={1.8}
                fontStyle="italic"
              >
                "{about.mission}"
              </Typography>
            </Box>
          </MotionSection>
        </Container>
      </Box>

      {/* Timeline */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <MotionSection as="div" variants={fadeUp}>
            <Typography
              variant="overline"
              color="secondary.dark"
              display="block"
              mb={1}
              textAlign="center"
            >
              Our Journey
            </Typography>
            <Typography variant="h3" textAlign="center" mb={8}>
              A History of Excellence
            </Typography>
          </MotionSection>

          <Box sx={{ position: "relative" }}>
            {/* Vertical line */}
            <Box
              sx={{
                position: "absolute",
                left: { xs: 16, md: "50%" },
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: "divider",
                transform: { md: "translateX(-50%)" },
              }}
            />

            {about.timeline.map((item, i) => (
              <MotionSection
                key={item.year}
                as="div"
                variants={i % 2 === 0 ? fadeLeft : fadeRight}
                delay={0.05 * i}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "row",
                      md: i % 2 === 0 ? "row-reverse" : "row",
                    },
                    mb: 6,
                    position: "relative",
                  }}
                >
                  {/* Dot */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: { xs: 10, md: "50%" },
                      transform: { xs: "none", md: "translateX(-50%)" },
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "secondary.main",
                      border: "3px solid white",
                      boxShadow: "0 0 0 2px #c9a84c",
                      zIndex: 1,
                      top: 8,
                    }}
                  />

                  {/* Content */}
                  <Box
                    sx={{
                      ml: { xs: 6, md: i % 2 === 0 ? 0 : "52%" },
                      mr: { xs: 0, md: i % 2 === 0 ? "52%" : 0 },
                      maxWidth: { xs: "100%", md: "42%" },
                      textAlign: {
                        xs: "left",
                        md: i % 2 === 0 ? "right" : "left",
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ color: "secondary.dark", fontWeight: 700, mb: 0.5 }}
                    >
                      {item.year}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.event}
                    </Typography>
                  </Box>
                </Box>
              </MotionSection>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
