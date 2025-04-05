
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PlusCircle, Loader2 } from 'lucide-react';

type Repair = Database['public']['Tables']['repairs']['Row'];

const RepairsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('repairs')
          .select('*')
          .order('date_created', { ascending: false });
        
        if (error) throw error;
        
        setRepairs(data || []);
      } catch (error) {
        console.error('Error fetching repairs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load repairs. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepairs();
  }, [toast]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending_confirmation':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_collection':
        return 'bg-blue-100 text-blue-800';
      case 'in_repair':
        return 'bg-purple-100 text-purple-800';
      case 'waiting_price_confirmation':
        return 'bg-orange-100 text-orange-800';
      case 'repair_in_progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'fixed_awaiting_delivery':
        return 'bg-green-100 text-green-800';
      case 'repair_rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <DashboardLayout title="My Repairs">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">All Repairs</h2>
        <Button className="bg-sala7li-primary hover:bg-sala7li-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Request New Repair
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-sala7li-primary" />
        </div>
      ) : repairs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-center mb-4">
              You don't have any repairs yet. Create your first repair request to get started.
            </p>
            <Button className="bg-sala7li-primary hover:bg-sala7li-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Request New Repair
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {repairs.map((repair) => (
            <Card key={repair.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{repair.device_type} - {repair.device_model}</CardTitle>
                    <p className="text-sm text-gray-500">Created on: {new Date(repair.date_created).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(repair.status)}`}>
                    {formatStatus(repair.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Issue:</span>
                    <p className="text-sm">{repair.issue}</p>
                  </div>
                  {repair.price && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Price:</span>
                      <p className="text-sm">${repair.price}</p>
                    </div>
                  )}
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm" className="text-sala7li-primary border-sala7li-primary hover:bg-sala7li-primary/10">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default RepairsList;
