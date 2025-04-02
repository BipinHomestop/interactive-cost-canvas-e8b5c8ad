
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export function TestEmailSender() {
  const [email, setEmail] = useState('bipin@homestop.us');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!email) {
      toast.error({
        title: "Email Required",
        description: "Please enter an email address"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        method: 'POST',
        body: { recipients: [email] }
      });

      if (error) {
        console.error("Error sending test email:", error);
        toast.error({
          title: "Email Failed",
          description: error.message || "Failed to send test email"
        });
        setResult({ success: false, error: error.message });
      } else {
        console.log("Test email response:", data);
        toast.success({
          title: "Email Sent",
          description: `Test email sent to ${email}`
        });
        setResult(data);
      }
    } catch (err: any) {
      console.error("Exception sending test email:", err);
      toast.error({
        title: "Email Failed",
        description: err.message || "An error occurred"
      });
      setResult({ success: false, error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Send Test Email</CardTitle>
        <CardDescription>
          Use this tool to send a test email and verify your email configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recipient email"
            />
          </div>
          
          {result && (
            <div className="mt-4 p-3 rounded text-sm overflow-auto max-h-48 bg-gray-50 border">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={sendTestEmail}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </Button>
      </CardFooter>
    </Card>
  );
}
