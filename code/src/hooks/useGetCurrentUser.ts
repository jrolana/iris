import { supabaseClient as supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { UserType } from '@/lib/types/users';

export const  useGetCurrentUser =  () => {
    
    const [user, setUser] = useState< UserType["Row"] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
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
