import type { Metadata } from "next";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { getSiteContent } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our expert real estate team.",
};

export default function ContactPage() {
  const { brand } = getSiteContent();

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 12 },
        pb: 10,
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            color="secondary.dark"
            display="block"
            mb={1}
          >
            Get In Touch
          </Typography>
          <Typography variant="h2" mb={2}>
            We'd Love to Hear From You
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 500, mx: "auto" }}
          >
            Whether you're buying, selling, or just exploring your options — our
            team is ready to help.
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {/* Contact info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                {
                  icon: <PhoneIcon color="secondary" />,
                  label: "Phone",
                  value: brand.phone,
                  href: `tel:${brand.phone}`,
                },
                {
                  icon: <EmailIcon color="secondary" />,
                  label: "Email",
                  value: brand.email,
                  href: `mailto:${brand.email}`,
                },
                {
                  icon: <LocationOnIcon color="secondary" />,
                  label: "Office",
                  value: brand.address,
                  href: `https://maps.google.com/?q=${encodeURIComponent(brand.address)}`,
                },
              ].map(({ icon, label, value, href }) => (
                <Box
                  key={label}
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "rgba(201,168,76,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography
                      component="a"
                      href={href}
                      target={href.startsWith("https") ? "_blank" : undefined}
                      rel={
                        href.startsWith("https")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      variant="body1"
                      sx={{
                        display: "block",
                        color: "text.primary",
                        textDecoration: "none",
                        fontWeight: 500,
                        "&:hover": { color: "secondary.dark" },
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="body2" color="text.secondary">
              <strong>Office Hours</strong>
              <br />
              Monday – Friday: 9:00 AM – 7:00 PM
              <br />
              Saturday: 10:00 AM – 5:00 PM
              <br />
              Sunday: By appointment
            </Typography>
          </Grid>

          {/* Contact form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}
            >
              <Typography variant="h5" fontWeight={700} mb={3}>
                Send Us a Message
              </Typography>
              <ContactForm sourcePage="/contact" />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
