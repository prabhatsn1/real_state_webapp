"use client";
import { useActionState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { signInMock } from "@/lib/mock/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
      signInMock(email);
      router.push(mode === "signup" ? "/listings" : "/");
      router.refresh();
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError(
        "Supabase is not configured. Please add your .env.local credentials.",
      );
      setLoading(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        router.push("/listings");
        router.refresh();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/");
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        name="email"
        label="Email Address"
        type="email"
        fullWidth
        required
        autoComplete="email"
        inputProps={{ "aria-required": "true" }}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        required
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        inputProps={{ "aria-required": "true", minLength: 6 }}
        helperText={mode === "signup" ? "Minimum 6 characters" : undefined}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={18} color="inherit" /> : null
        }
      >
        {loading
          ? mode === "login"
            ? "Signing in…"
            : "Creating account…"
          : mode === "login"
            ? "Sign In"
            : "Create Account"}
      </Button>

      <Divider />

      <Typography variant="body2" textAlign="center">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Box
              component={Link}
              href="/signup"
              sx={{
                color: "secondary.dark",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up free
            </Box>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Box
              component={Link}
              href="/login"
              sx={{
                color: "secondary.dark",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Box>
          </>
        )}
      </Typography>
    </Box>
  );
}
