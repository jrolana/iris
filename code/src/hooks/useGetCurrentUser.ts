import { supabaseClient as supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { UserType } from '@/lib/types/users';
import { getE2EAuthUser, getE2EUserFromDocument } from '@/lib/e2e-auth';

export const  useGetCurrentUser =  () => {
    
    const [user, setUser] = useState< UserType["Row"] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const e2eUser = getE2EUserFromDocument();
                if (e2eUser) {
                    setUser(e2eUser);
                    return;
                }

                const fallbackUser = getE2EAuthUser();
                const { data: { user: authUser } } = await supabase.auth.getUser();
                const user = fallbackUser ?? authUser;
                const { data: userData } = await supabase.schema("private").from("users").select("*").eq("id", user?.id ?? "").maybeSingle();
                setUser(userData ?? null);
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    return { user, loading };
}
