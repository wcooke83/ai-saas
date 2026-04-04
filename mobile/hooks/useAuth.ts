import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';

export function useAuth() {
  const { session, user, agentName, setSession, setAgentName } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { setSession: set } = useAuthStore.getState();

    // Restore session on mount
    supabase.auth.getSession().then(({ data }) => {
      set(data.session);
      setLoading(false);
    });

    // Stay in sync with auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      set(newSession);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Default agent name to email prefix if not set
  const resolvedAgentName = agentName || (user?.email?.split('@')[0] ?? 'Agent');

  return { session, user, loading, agentName: resolvedAgentName, setAgentName };
}
