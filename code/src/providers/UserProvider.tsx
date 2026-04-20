"use client";

import { useEffect, useMemo } from "react";
import { useSetAtom } from "jotai";
import { userAtom } from "@/atom-states/user";
import { createClient } from "../../utils/supabase/client";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useSetAtom(userAtom);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (isMounted) setUser(null);
        return;
      }

      const { data, error } = await supabase
        .schema("private")
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        if (isMounted) setUser(null);
        return;
      }

      // set the global Jotai state
      //   this will be used across the app for authorization and other user-specific features
      if (isMounted) {
        setUser({
          ...data,
          image_url: session.user.user_metadata?.avatar_url ?? undefined,
        });
      }
    };

    fetchUserDetails();

    // cleanup function to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    };
  }, [setUser, supabase]);

  return <>{children}</>;
}
