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
import LoadingSpinner from "@components/LoadingSpinner";
import Navbar from "@components/Navbar";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    setLoader(true);
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

    signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    }).then((res) => {
      if (!res?.ok) {
        toast("Invalid credentials", {
          description: "Please check your email and password.",
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
      } else {
        router.push("/");
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
      }

      setLoader(false);
    });

    setEmail("");
    setPassword("");
  };

  const handleGuestLogin = () => {
    setGuestLoader(true);

    signIn("credentials", {
      email: "guestuser@gmail.com",
      password: "password",
      redirect: false,
    }).then((res) => {
      if (!res?.ok) {
        toast("Invalid credentials", {
          description: "Please check your email and password.",
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
      } else {
        router.push("/");
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
      }

      setGuestLoader(false);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md bg-leetcode-dark border-[#3e3e3e] text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Welcome back to Algo-arena
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
                  <span className="text-xs text-leetcode-primary hover:underline">
                    Forgot password?
                  </span>
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
                disabled={guestLoader || loader}
              >
                {loader ? (
                  <div className=" flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>Sign In</>
                )}
              </Button>
              <Button
                onClick={handleGuestLogin}
                className="w-full bg-blue-500 hover:bg-blue-500/90 cursor-pointer"
                disabled={guestLoader || loader}
              >
                {guestLoader ? (
                  <div className=" flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>Guest Login</>
                )}
              </Button>

              <p className="text-sm text-center">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-leetcode-primary hover:underline cursor-pointer"
                >
                  Create one
                </Link>
              </p>
              <div className=" flex flex-col justify-center items-center space-y-2">
                <span>or</span>
                <Button
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "/",
                    })
                  }
                  className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-violet-600 font-semibold"
                  disabled={guestLoader || loader}
                >
                  <Image
                    src="/google-icon.svg"
                    alt="icon"
                    height={48}
                    width={48}
                    className=" h-7 w-7"
                  />
                  Sign up with Google
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
