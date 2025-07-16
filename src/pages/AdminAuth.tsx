import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/auth/AdminLogin';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MetaTags } from '@/seo/MetaTags';

const AdminAuth: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First check if any admin users exist
      const { data: hasAdmins, error: adminCheckError } = await supabase.rpc('has_admin_users');
      
      if (adminCheckError) {
        console.error('Admin check error:', adminCheckError);
      } else if (!hasAdmins) {
        // No admin users exist, redirect to setup
        navigate('/admin/setup');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is an admin
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', session.user.email)
          .eq('is_active', true)
          .single();
        
        if (adminData) {
          setIsAuthenticated(true);
          navigate('/analytics');
          return;
        } else {
          // User is authenticated but not an admin, sign them out
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/analytics');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to analytics
  }

  return (
    <>
      <MetaTags 
        customMeta={{
          title: "Admin Login - American Concrete Coatings",
          description: "Admin login page for American Concrete Coatings dashboard",
          keywords: "admin, login, dashboard",
          robots: "noindex, nofollow",
          canonical: "https://costcalculator.americanconcretecoatings.com/admin",
          og: {
            title: "Admin Login",
            description: "Admin login page",
            type: "website",
            siteName: "American Concrete Coatings",
            locale: "en_US"
          },
          twitter: {
            card: "summary",
            site: "@dfwACC",
            creator: "@dfwACC",
            title: "Admin Login",
            description: "Admin login page"
          }
        }}
      />
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default AdminAuth;