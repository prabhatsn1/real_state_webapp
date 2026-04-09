import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AuthPageLayout from "@/components/AuthPageLayout";

export const metadata: Metadata = { title: "Create Account" };

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export default async function SignupPage() {
  if (!IS_MOCK) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/");
  }

  return <AuthPageLayout mode="signup" />;
}
