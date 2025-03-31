
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const OperatorDashboard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Operator Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="new" className="space-y-4">
          <TabsList>
            <TabsTrigger value="new">New Requests</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="new" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Service Requests</CardTitle>
                <CardDescription>Requests waiting for your confirmation</CardDescription>
              </CardHeader>
              <CardContent>
                <p>New service requests will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Confirmed Requests</CardTitle>
                <CardDescription>History of requests you've confirmed</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your confirmed request history will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorDashboard;
