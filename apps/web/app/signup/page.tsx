"use client";
import { Button } from "@components/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";
import { Checkbox } from "@components/components/ui/checkbox";
import { Input } from "@components/components/ui/input";
import Navbar from "@components/Navbar";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Form submitted");
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      toast("Missing information", {
        description: "Please fill out all required fields.",
        style: {
          background: "#1e1e1e",
          color: "#eff2f699",
        },
        action: {
          label: "Try again",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords do not match", {
        description: "Please make sure your passwords match.",
        style: {
          background: "#1e1e1e",
          color: "#eff2f699",
        },
        action: {
          label: "Try again",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      return;
    }

    if (!agreedToTerms) {
      toast("You must agree to the terms", {
        description: "Please agree to the terms of service and privacy policy.",
        style: {
          background: "#1e1e1e",
          color: "#eff2f699",
        },
        action: {
          label: "Try again",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      return;
    }

    // In a real app, we would send this data href a backend service
    toast("Account created successfully", {
      description: "Welcome aboard! You can now log in.",
      style: {
        background: "#1e1e1e",
        color: "#eff2f699",
      },
      action: {
        label: "Go to login",
        onClick: () => {
          toast.dismiss();
          window.location.href = "/login";
        },
      },
    });

    // Reset form
    setEmail("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setAgreedToTerms(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-leetcode-dark border-[#3e3e3e] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center ">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Join Algo-arena today to start solving coding challenges
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="bg-[#323232] border-[#3e3e3e]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input
                  id="username"
                  placeholder="coolcoder123"
                  className="bg-[#323232] border-[#3e3e3e]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-[#323232] border-[#3e3e3e]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="bg-[#323232] border-[#3e3e3e]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 my-4">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked as boolean);
                  }}
                  className="h-4 w-4 text-leetcode-primary border-[#3e3e3e] rounded focus:ring-2 focus:ring-leetcode-primary/50 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-leetcode-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-leetcode-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-leetcode-primary hover:bg-leetcode-primary/90 cursor-pointer"
              >
                Create Account
              </Button>

              <p className="text-sm text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-leetcode-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default SignupPage;
