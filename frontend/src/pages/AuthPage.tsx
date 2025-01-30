import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock, User, Wallet } from "lucide-react";
import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [walletId, setWalletId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (isLogin) {
        await axios.post("/auth/login", { email, password });
        setMessage("Login successful");
        navigate("/tokens");
      } else {
        const response = await axios.post("/auth/register", {
          name,
          email,
          password,
          walletId,
        });
        setMessage(response.data.message);
        setIsRegistered(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      const name = user.displayName || "";
      const email = user.email || "";
      const profilePic = user.photoURL || "";
      await axios.post("/auth/google-login", {
        name,
        email,
        profilePic,
      });
      setMessage("Google sign-in successful");
      navigate("/tokens");
    } catch (error) {
      setError("Failed to complete Google Sign-In");
      console.error(error);
    }
  };

  if (isRegistered) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification email to {email}. Please check your
              inbox and click the verification link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-4">
              <AlertTitle>Next Steps</AlertTitle>
              <AlertDescription>
                1. Check your email inbox (and spam folder). 2. Click the
                verification link in the email. 3. Once verified, you can log in
                to your account.
              </AlertDescription>
            </Alert>
            <Button onClick={() => setIsRegistered(false)} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Welcome back! Please login to your account."
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert variant="default" className="mb-4">
              <AlertTitle>Message</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="walletId">Wallet ID</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="walletId"
                    type="text"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
          >
            Sign in with Google
          </Button>
          <Button
            onClick={() => setIsLogin(!isLogin)}
            variant="link"
            className="w-full"
          >
            {isLogin ? "Need to register?" : "Already have an account?"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
