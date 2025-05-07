import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL || '',
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''
);

const AdminLogin = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdminStatus(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminStatus(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (session && !isAdmin) {
    return (
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <p className="text-center text-red-600">Access denied. You must be an admin to view this page.</p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-4 w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-[rgb(71,85,105)] mb-6 text-center">Admin Login</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'rgb(71,85,105)',
                brandAccent: 'rgb(51,65,85)'
              }
            }
          }
        }}
        providers={[]}
        view="sign_in"
        showLinks={true}
        redirectTo={`${window.location.origin}/admin`}
      />
    </div>
  );
};

export default AdminLogin;