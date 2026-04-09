import type { Metadata } from "next";
import { Box, Container, Typography, Divider } from "@mui/material";
import { getSiteContent } from "@/lib/data";
import type { PolicyDoc } from "@/types/schema";

function PolicyPage({ doc }: { doc: PolicyDoc }) {
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
        <Typography variant="h2" mb={1}>
          {doc.title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={5}
        >
          Last updated:{" "}
          {new Date(doc.lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>
        <Divider sx={{ mb: 5 }} />
        {doc.sections.map((section) => (
          <Box key={section.heading} sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} mb={1.5}>
              {section.heading}
            </Typography>
            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              {section.body}
            </Typography>
          </Box>
        ))}
      </Container>
    </Box>
  );
}

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  const { policies } = getSiteContent();
  return <PolicyPage doc={policies.privacy} />;
}
