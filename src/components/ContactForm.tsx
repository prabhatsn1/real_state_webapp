"use client";
import { useActionState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { submitEnquiry, type EnquiryState } from "@/lib/actions/enquiry";

const initialState: EnquiryState = { success: false };

interface ContactFormProps {
  listingId?: string;
  agentId?: string;
  sourcePage?: string;
}

export default function ContactForm({
  listingId,
  agentId,
  sourcePage,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitEnquiry,
    initialState,
  );

  if (state.success) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          py: 4,
          color: "success.main",
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 56 }} />
        <Box sx={{ textAlign: "center" }}>
          <strong>Message sent!</strong>
          <br />
          <span style={{ color: "#5a5a7a", fontSize: "0.9rem" }}>
            We&lsquo;ll get back to you within one business day.
          </span>
        </Box>
      </Box>
    );
  }

  return (
    <Box component="form" action={formAction} noValidate>
      {/* Hidden fields */}
      {listingId && <input type="hidden" name="listing_id" value={listingId} />}
      {agentId && <input type="hidden" name="agent_id" value={agentId} />}
      {sourcePage && (
        <input type="hidden" name="source_page" value={sourcePage} />
      )}

      {state.error && !state.fieldErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            required
            error={Boolean(state.fieldErrors?.name)}
            helperText={state.fieldErrors?.name?.[0]}
            inputProps={{ autoComplete: "name", "aria-required": "true" }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            required
            error={Boolean(state.fieldErrors?.email)}
            helperText={state.fieldErrors?.email?.[0]}
            inputProps={{ autoComplete: "email", "aria-required": "true" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="phone"
            label="Phone (optional)"
            fullWidth
            inputProps={{ autoComplete: "tel" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            name="message"
            label="Message"
            multiline
            rows={4}
            fullWidth
            required
            error={Boolean(state.fieldErrors?.message)}
            helperText={state.fieldErrors?.message?.[0]}
            inputProps={{ "aria-required": "true" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isPending}
            startIcon={
              isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SendIcon />
              )
            }
          >
            {isPending ? "Sending…" : "Send Message"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
