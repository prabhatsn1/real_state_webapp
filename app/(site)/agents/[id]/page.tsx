import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Button,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import TranslateIcon from "@mui/icons-material/Translate";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getAgentById, getAgents, getListingsByAgent } from "@/lib/data";
import ListingCard from "@/components/listings/ListingCard";
import ContactForm from "@/components/ContactForm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAgents().map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) return { title: "Agent Not Found" };
  return { title: agent.name, description: agent.bio };
}

export default async function AgentDetailPage({ params }: Props) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();
  const listings = getListingsByAgent(id);

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
        <Grid container spacing={5}>
          {/* Left sidebar: agent info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "sticky", top: 90 }}>
              <Paper sx={{ p: 3, mb: 3 }} elevation={0} variant="outlined">
                <Avatar
                  src={agent.photo}
                  alt={agent.name}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    objectFit: "cover",
                  }}
                />
                <Typography variant="h4" textAlign="center" mb={0.5}>
                  {agent.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mb={2}
                >
                  {agent.title}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  flexWrap="wrap"
                  mb={3}
                >
                  {agent.specialties.map((s) => (
                    <Chip
                      key={s}
                      label={s}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  ))}
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">{agent.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TranslateIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                    <Typography variant="body2">
                      {agent.languages.join(", ")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      🏆 {agent.salesCount} sales completed
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button
                    component="a"
                    href={`tel:${agent.phone}`}
                    startIcon={<CallIcon />}
                    variant="outlined"
                    fullWidth
                    size="small"
                    aria-label={`Call ${agent.name}`}
                  >
                    Call
                  </Button>
                  <Button
                    component="a"
                    href={`mailto:${agent.email}`}
                    startIcon={<EmailIcon />}
                    variant="contained"
                    fullWidth
                    size="small"
                    aria-label={`Email ${agent.name}`}
                  >
                    Email
                  </Button>
                </Stack>
              </Paper>

              <Paper sx={{ p: 3 }} elevation={0} variant="outlined">
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Send a Message
                </Typography>
                <ContactForm
                  agentId={agent.id}
                  sourcePage={`/agents/${agent.id}`}
                />
              </Paper>
            </Box>
          </Grid>

          {/* Main content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              About {agent.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={6}
              lineHeight={1.8}
            >
              {agent.bio}
            </Typography>

            {listings.length > 0 && (
              <>
                <Typography variant="h5" fontWeight={700} mb={3}>
                  Active Listings ({listings.length})
                </Typography>
                <Grid container spacing={3}>
                  {listings.map((listing) => (
                    <Grid key={listing.id} size={{ xs: 12, sm: 6 }}>
                      <ListingCard listing={listing} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
