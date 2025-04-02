
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Phone, Shield, Camera, Save } from "lucide-react";

interface AccountPageProps {
  role: "admin" | "fixer" | "operator" | "collector" | "user";
}

const AccountPage = ({ role }: AccountPageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    browser: true,
    sms: false
  });

  // Get user's initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully."
    });
    
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved."
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card className="mb-6">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-sala7li-primary text-white text-2xl">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              <div className="bg-sala7li-primary/10 text-sala7li-primary px-3 py-1 rounded-full text-sm font-medium capitalize">
                {role}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="font-medium">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Status:</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <span className="font-medium capitalize">{role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Joined Date:</span>
                <span className="font-medium">Jan 15, 2023</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="name"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileFormChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileFormChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="phone"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileFormChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileFormChange}
                        className="w-full min-h-[100px] p-2 border border-input rounded-md resize-y"
                        placeholder="Tell us a bit about yourself"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordFormChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordFormChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Update Password</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <form onSubmit={handleNotificationSubmit}>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive repair updates via email</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="email"
                          name="email"
                          type="checkbox"
                          checked={notificationSettings.email}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-sala7li-primary focus:ring-sala7li-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser">Browser Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="browser"
                          name="browser"
                          type="checkbox"
                          checked={notificationSettings.browser}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-sala7li-primary focus:ring-sala7li-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive repair updates via SMS</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          id="sms"
                          name="sms"
                          type="checkbox"
                          checked={notificationSettings.sms}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-sala7li-primary focus:ring-sala7li-primary"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Preferences</Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
