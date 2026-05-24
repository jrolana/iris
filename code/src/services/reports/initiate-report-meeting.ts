"use server"

import { supabaseAdmin } from "../../../utils/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/constants/admin";

interface InitiateMeetingProps {
  reportedUserId: string;
  appId: string;
}

export async function initiateReportMeeting(props: InitiateMeetingProps) {
  const { reportedUserId, appId } = props;

  const { data: otherCollaboratorsEmails, error: collaboratorsError } = await supabaseAdmin
  .schema("private")
  .from("inventors")
  .select(`
    email,
    ipr_applications!application_id (
      project_title
    )
  `)
  .eq("application_id", appId)
  .neq("id", reportedUserId); 

  if (collaboratorsError) {
    throw new Error(`Failed to fetch collaborators: ${collaboratorsError.message}`);
  }

  if (otherCollaboratorsEmails.length === 0) {
    throw new Error("No collaborators available to CC after filtering.");
  }

  const { data, error } = await supabaseAdmin.functions.invoke('initiate-report-meeting', {
    body: {
      adminEmail: ADMIN_EMAIL,
      ccEmails: otherCollaboratorsEmails.map((collaborator) => collaborator.email),
      projectTitle: (otherCollaboratorsEmails[0]?.ipr_applications as unknown as { project_title: string })?.project_title || "<No Project Title>"
    }
  });

  if (error) {
    throw new Error(`Failed to initiate meeting: ${error.message}`);
  }

  const {error: updateError} = await supabaseAdmin.schema("private").from("reports").update({ is_meeting_initiated: true }).eq("application_id", appId).eq("subject_id", reportedUserId);

  if (updateError) {
    throw new Error(`Failed to update report: ${updateError.message}`);
  }


  return data;
}