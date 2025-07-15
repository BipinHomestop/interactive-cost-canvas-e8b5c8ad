
import React, { useEffect, useState } from 'react';
import { AnalyticsContainer } from '@/components/analytics/AnalyticsContainer';
import { MetaTags } from '@/seo/MetaTags';
import { getAnalyticsPageMetaTags } from '@/seo/meta-utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Analytics() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin');
        return;
      }

      // Check if user is an admin
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('id, email')
        .eq('email', session.user.email)
        .eq('is_active', true)
        .single();

      if (error || !adminData) {
        await supabase.auth.signOut();
        navigate('/admin');
        return;
      }

      setIsAuthenticated(true);
      setUserEmail(adminData.email);
      
      // Log access
      await supabase.rpc('log_security_event', {
        event_type: 'analytics_access',
        user_id: session.user.id,
        details: { email: adminData.email }
      });
    } catch (error) {
      console.error('Authentication check failed:', error);
      navigate('/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MetaTags customMeta={getAnalyticsPageMetaTags()} />
      
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
              <p className="text-sm text-gray-500">Logged in as: {userEmail}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      <AnalyticsContainer />
    </div>
  );
}
