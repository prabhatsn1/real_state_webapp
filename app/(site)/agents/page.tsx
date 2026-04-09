import type { Metadata } from "next";
import { Box, Container, Grid, Typography } from "@mui/material";
import { getAgents } from "@/lib/data";
import AgentCard from "@/components/agents/AgentCard";

export const metadata: Metadata = {
  title: "Our Agents",
  description: "Meet the expert real estate agents at Prestige Realty.",
};

export default function AgentsPage() {
  const agents = getAgents();

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
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Typography
            variant="overline"
            color="secondary.dark"
            display="block"
            mb={1}
          >
            Our Team
          </Typography>
          <Typography variant="h2" mb={2}>
            Expert Agents
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 540, mx: "auto" }}
          >
            Our agents bring decades of combined experience and deep local
            expertise to every transaction.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {agents.map((agent) => (
            <Grid key={agent.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <AgentCard agent={agent} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
