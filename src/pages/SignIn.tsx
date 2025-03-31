
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Check for admin credentials (in a real app, this would be handled by backend)
      if (formData.email === "admin@sala7li.com" && formData.password === "admin123") {
        toast({
          title: "Login successful!",
          description: "Welcome back, Admin.",
        });
        navigate("/admin");
        return;
      }
      
      // Check for fixer credentials
      if (formData.email === "fixer@sala7li.com" && formData.password === "fixer123") {
        toast({
          title: "Login successful!",
          description: "Welcome back, Fixer.",
        });
        navigate("/fixer");
        return;
      }
      
      // Check for operator credentials
      if (formData.email === "operator@sala7li.com" && formData.password === "operator123") {
        toast({
          title: "Login successful!",
          description: "Welcome back, Operator.",
        });
        navigate("/operator");
        return;
      }
      
      // Check for collector credentials
      if (formData.email === "collector@sala7li.com" && formData.password === "collector123") {
        toast({
          title: "Login successful!",
          description: "Welcome back, Collector.",
        });
        navigate("/collector");
        return;
      }
      
      // Default to user dashboard for all other logins
      toast({
        title: "Login successful!",
        description: "Welcome back to Sala7li.",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Google login successful!",
        description: "Welcome back to Sala7li.",
      });
      
      // Google sign in only for customers
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-sala7li-primary">{t('app.name')}</h1>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">{t('auth.signin.title')}</h2>
          <p className="mt-2 text-gray-600">
            {t('auth.new.customer')}{" "}
            <Link to="/signup" className="text-sala7li-primary hover:underline">
              {t('auth.create.account')}
            </Link>
          </p>
          <div className="mt-2 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <a href="#" className="text-sm text-sala7li-primary hover:underline">
                    {t('auth.forgot.password')}
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <p className="text-xs text-amber-600 mt-2">
                {t('auth.staff.note')}
              </p>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('auth.signin.button') + "..." : t('auth.signin.button')}
              </Button>
            </form>
            
            <div className="mt-4 flex items-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <p className="mx-4 text-sm text-gray-400">{t('auth.or')}</p>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {t('auth.google')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
