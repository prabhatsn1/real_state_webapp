import type { Metadata } from "next";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getSiteContent } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about buying, selling, and renting with Prestige Realty.",
};

export default function FAQPage() {
  const { faq } = getSiteContent();

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 12 },
        pb: 10,
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="overline"
            color="secondary.dark"
            display="block"
            mb={1}
          >
            Got Questions?
          </Typography>
          <Typography variant="h2" mb={2}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Can't find the answer you're looking for?{" "}
            <Link
              href="/contact"
              style={{
                color: "inherit",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Contact our team
            </Link>
            .
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {faq.map((item, i) => (
            <Accordion key={item.id} defaultExpanded={i === 0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`faq-${item.id}-content`}
                id={`faq-${item.id}-header`}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: "1rem", py: 0.5 }}
                >
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.8}
                >
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
