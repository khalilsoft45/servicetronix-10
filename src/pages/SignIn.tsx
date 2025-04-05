
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAuthError("");
    
    try {
      const success = await login(values.email, values.password);
      
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        navigate("/dashboard");
      } else {
        setAuthError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setAuthError("An error occurred during login. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login credentials for quick testing
  const demoAccounts = [
    { role: "User", email: "user@sala7li.com", password: "user123" },
    { role: "Admin", email: "admin@sala7li.com", password: "admin123" },
    { role: "Fixer", email: "fixer@sala7li.com", password: "fixer123" },
    { role: "Operator", email: "operator@sala7li.com", password: "operator123" },
    { role: "Collector", email: "collector@sala7li.com", password: "collector123" },
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
    
    await onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {authError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  {demoAccounts.map((account) => (
                    <div key={account.role} className="bg-gray-50 p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{account.role}</p>
                          <p className="text-xs text-gray-500">{account.email}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDemoLogin(account.email, account.password)}
                        >
                          Use
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-sala7li-primary hover:text-sala7li-primary/80">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
