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
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();

  if (actingUserError) {
    throw new Error(actingUserError.message);
  }

  if (actingUser.role !== "admin") {
    throw new Error("Only admins can manage public resources.");
  }

  return actingUser;
}

export async function uploadPublicResource(formData: FormData) {
  const actingUser = await assertServerCurrentUserIsAdmin();

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

  await supabaseAdmin.schema("private").from("audit_trail").insert({
    snapshot_user_name: actingUser.full_name,
    snapshot_user_role: actingUser.role,
    action_type: "upload",
    action_taken: "Uploaded public resource document",
    action_result: "success",
    record_type: "document",
    snapshot_record_reference: filePath,
    changed_fields: {
      after: {
        bucket: BUCKET_NAME,
        file_path: filePath,
        ip_type: ipType,
        content_type: file.type || null,
      },
    },
  });

  return data;
}

export async function logPublicResourceUpload(props: {
  ipType: IpType;
  filePath: string;
  contentType: string | null;
}) {
  const actingUser = await assertServerCurrentUserIsAdmin();
  const { ipType, filePath, contentType } = props;

  await supabaseAdmin.schema("private").from("audit_trail").insert({
    snapshot_user_name: actingUser.full_name,
    snapshot_user_role: actingUser.role,
    action_type: "upload",
    action_taken: "Uploaded public resource document",
    action_result: "success",
    record_type: "document",
    snapshot_record_reference: filePath,
    changed_fields: {
      after: {
        bucket: BUCKET_NAME,
        file_path: filePath,
        ip_type: ipType,
        content_type: contentType,
      },
    },
  });
}

export async function deletePublicResource(fullPath: string) {
  const actingUser = await assertServerCurrentUserIsAdmin();

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([fullPath]);

  if (error) {
    throw new Error(error.message);
  }

  await supabaseAdmin.schema("private").from("audit_trail").insert({
    snapshot_user_name: actingUser.full_name,
    snapshot_user_role: actingUser.role,
    action_type: "delete",
    action_taken: "Deleted public resource document",
    action_result: "success",
    record_type: "document",
    snapshot_record_reference: fullPath,
    changed_fields: {
      before: {
        bucket: BUCKET_NAME,
        file_path: fullPath,
      },
    },
  });

  return data;
}
