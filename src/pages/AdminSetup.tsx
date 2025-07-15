import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { MetaTags } from '@/seo/MetaTags';

const AdminSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasAdminUsers, setHasAdminUsers] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('has_admin_users');
      if (error) throw error;
      
      setHasAdminUsers(data);
      
      // If admin users exist, redirect to login
      if (data) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setError('Failed to check admin status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Call the admin setup edge function
      const { data, error } = await supabase.functions.invoke('admin-setup', {
        body: { email, password }
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Admin user created successfully. You can now log in.',
      });

      // Redirect to admin login
      navigate('/admin');
    } catch (error: any) {
      console.error('Setup error:', error);
      setError(error.message || 'Failed to create admin user');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking setup status...</p>
        </div>
      </div>
    );
  }

  if (hasAdminUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Setup Complete</CardTitle>
            <CardDescription>
              Admin user already exists. Redirecting to login...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        customMeta={{
          title: "Admin Setup - American Concrete Coatings",
          description: "Admin setup page for American Concrete Coatings dashboard",
          keywords: "admin, setup, dashboard",
          robots: "noindex, nofollow",
          og: {
            title: "Admin Setup",
            description: "Admin setup page",
            url: "https://quote.garagefloorcoatingsdfw.com/admin/setup",
            type: "website",
            siteName: "American Concrete Coatings",
            locale: "en_US"
          },
          twitter: {
            card: "summary",
            site: "@dfwACC",
            creator: "@dfwACC",
            title: "Admin Setup",
            description: "Admin setup page"
          }
        }}
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              Create the first admin user to access the analytics dashboard
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Admin User...' : 'Create Admin User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AdminSetup;