
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const CollectorDashboard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Collector Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="pickup" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pickup">Pickup Requests</TabsTrigger>
            <TabsTrigger value="collected">Collected Devices</TabsTrigger>
          </TabsList>
          <TabsContent value="pickup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pickup Requests</CardTitle>
                <CardDescription>Devices waiting for collection</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your assigned pickup requests will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="collected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Collected Devices</CardTitle>
                <CardDescription>History of devices you've collected</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your collected device history will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CollectorDashboard;
