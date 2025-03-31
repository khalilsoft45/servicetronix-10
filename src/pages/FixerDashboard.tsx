
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const FixerDashboard = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Fixer Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
        <Tabs defaultValue="assigned" className="space-y-4">
          <TabsList>
            <TabsTrigger value="assigned">Assigned Repairs</TabsTrigger>
            <TabsTrigger value="completed">Completed Repairs</TabsTrigger>
          </TabsList>
          <TabsContent value="assigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Repair Requests</CardTitle>
                <CardDescription>Devices assigned to you for repair</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your assigned repair requests will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Repairs</CardTitle>
                <CardDescription>History of repairs you've completed</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your completed repair history will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FixerDashboard;
