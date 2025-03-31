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
import { Input } from "@components/components/ui/input";
import Navbar from "@components/Navbar";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
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

    // In a real app, we would send this data href a backend service
    toast("Login successful", {
      description: "Welcome back!",
      style: {
        background: "#1e1e1e",
        color: "#eff2f699",
      },
      action: {
        label: "Continue",
        onClick: () => {
          toast.dismiss();
        },
      },
    });

    // Reset form
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-leetcode-dark border-[#3e3e3e] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Welcome back to AlgoSandbox
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pb-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-leetcode-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="bg-[#323232] border-[#3e3e3e]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-leetcode-primary hover:bg-leetcode-primary/90"
              >
                Sign In
              </Button>

              <p className="text-sm text-center">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-leetcode-primary hover:underline"
                >
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
