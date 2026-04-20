"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "../../../utils/supabase/admin";
import { sanitizeFileName } from "@/lib/helper/sanitize-input";
import { IpType, IP_TYPES } from "@/lib/types/ip";

const BUCKET_NAME = "ipr_public_resources_bucket";

async function assertServerCurrentUserIsAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookieList) =>
          cookieList.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          ),
      },
    },
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be signed in to manage public resources.");
  }

  const { data: actingUser, error: actingUserError } = await supabase
    .schema("private")
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (actingUserError) {
    throw new Error(actingUserError.message);
  }

  if (actingUser.role !== "admin") {
    throw new Error("Only admins can manage public resources.");
  }
}

export async function uploadPublicResource(formData: FormData) {
  await assertServerCurrentUserIsAdmin();

  const ipType = formData.get("ipType");
  const file = formData.get("file");

  if (typeof ipType !== "string" || !IP_TYPES.includes(ipType as IpType)) {
    throw new Error("Invalid IP type.");
  }

  if (!(file instanceof File)) {
    throw new Error("No file was selected.");
  }

  const filePath = `${ipType}/${sanitizeFileName(file.name)}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deletePublicResource(fullPath: string) {
  await assertServerCurrentUserIsAdmin();

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([fullPath]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
