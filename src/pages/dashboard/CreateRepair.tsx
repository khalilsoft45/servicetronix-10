
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const CreateRepair = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    deviceType: '',
    deviceModel: '',
    issue: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a repair request.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!form.deviceType || !form.deviceModel || !form.issue) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('repairs')
        .insert({
          client_id: user.id,
          client_name: user.name,
          client_phone: user.phone || '', // Fallback to empty string if phone is not available
          device_type: form.deviceType,
          device_model: form.deviceModel,
          issue: form.issue,
          status: 'pending_confirmation',
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your repair request has been submitted.',
        variant: 'default',
      });
      
      // Navigate to the repairs list page
      navigate('/dashboard/repairs');
      
    } catch (error) {
      console.error('Error creating repair:', error);
      toast({
        title: 'Error',
        description: 'Failed to create repair request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout title="Request Repair">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center mb-4">
              Please sign in to request a repair.
            </p>
            <Button onClick={() => navigate('/signin')} className="bg-sala7li-primary hover:bg-sala7li-primary/90">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Request Repair">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Request a New Repair</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="deviceType">Device Type *</Label>
                <Input
                  id="deviceType"
                  name="deviceType"
                  placeholder="e.g., Smartphone, Laptop, Tablet"
                  value={form.deviceType}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="deviceModel">Device Model *</Label>
                <Input
                  id="deviceModel"
                  name="deviceModel"
                  placeholder="e.g., iPhone 12, Dell XPS 13"
                  value={form.deviceModel}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="issue">Issue Description *</Label>
                <Textarea
                  id="issue"
                  name="issue"
                  placeholder="Describe the problem with your device"
                  value={form.issue}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/repairs')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-sala7li-primary hover:bg-sala7li-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CreateRepair;
