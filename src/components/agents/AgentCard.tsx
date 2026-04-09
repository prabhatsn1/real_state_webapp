"use client";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import type { Agent } from "@/types/schema";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 48px rgba(26,26,46,0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height={260}
          image={agent.photo}
          alt={agent.name}
          sx={{ objectFit: "cover", objectPosition: "top" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(26,26,46,0.7) 0%, transparent 60%)",
          }}
        />
        <Box sx={{ position: "absolute", bottom: 12, left: 16 }}>
          <Typography
            variant="h6"
            sx={{ color: "white", fontWeight: 700, lineHeight: 1.2 }}
          >
            {agent.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.75)" }}
          >
            {agent.title}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {agent.bio.slice(0, 130)}…
        </Typography>

        <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
          {agent.specialties.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                color: "primary.main",
                borderColor: "primary.main",
              }}
            />
          ))}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.8rem" }}
        >
          📍 {agent.location} &nbsp;·&nbsp; {agent.salesCount} sales
        </Typography>
      </CardContent>

      <Box sx={{ px: 2.5, pb: 2.5, display: "flex", gap: 1 }}>
        <Button
          component="a"
          href={`tel:${agent.phone}`}
          size="small"
          variant="outlined"
          startIcon={<CallIcon fontSize="small" />}
          sx={{ flex: 1, fontSize: "0.75rem" }}
          aria-label={`Call ${agent.name}`}
        >
          Call
        </Button>
        <Button
          component="a"
          href={`mailto:${agent.email}`}
          size="small"
          variant="outlined"
          startIcon={<EmailIcon fontSize="small" />}
          sx={{ flex: 1, fontSize: "0.75rem" }}
          aria-label={`Email ${agent.name}`}
        >
          Email
        </Button>
        <Button
          component={Link}
          href={`/agents/${agent.id}`}
          size="small"
          variant="contained"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{ flex: 1, fontSize: "0.75rem" }}
          aria-label={`View ${agent.name}'s profile`}
        >
          Profile
        </Button>
      </Box>
    </Card>
  );
}
