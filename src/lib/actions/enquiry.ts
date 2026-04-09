"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const EnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  listing_id: z.string().optional(),
  agent_id: z.string().optional(),
  source_page: z.string().optional(),
});

export type EnquiryState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    message: formData.get("message") as string,
    listing_id: (formData.get("listing_id") as string) || undefined,
    agent_id: (formData.get("agent_id") as string) || undefined,
    source_page: (formData.get("source_page") as string) || undefined,
  };

  const parsed = EnquirySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // ── Mock mode: skip database ──────────────────────────────────────────────
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 400)); // simulate latency
    return { success: true };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("enquiries").insert(parsed.data);

  if (error) {
    return {
      success: false,
      error: "Failed to send enquiry. Please try again.",
    };
  }

  return { success: true };
}
