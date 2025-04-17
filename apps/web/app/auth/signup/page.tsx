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
import LoadingSpinner from "@components/LoadingSpinner";
import Navbar from "@components/Navbar";
import { Label } from "@radix-ui/react-label";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SignupPage = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setLoader(true);
      e.preventDefault();

      if (
        !formData.email ||
        !formData.username ||
        !formData.password ||
        !formData.confirmPassword
      ) {
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

      if (formData.password !== formData.confirmPassword) {
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
          description:
            "Please agree to the terms of service and privacy policy.",
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
        username: formData.username,
        email: formData.email,
        password: formData.password,
        redirect: false,
      }).then((res) => {
        if (res?.ok) {
          toast("Account created successfully", {
            description: "Welcome aboard! You can now log in.",
            style: {
              background: "#1e1e1e",
              color: "#eff2f699",
            },
          });

          router.push("/");

          setFormData({
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
          });
        } else {
          toast("Error creating account", {
            description: "Please try again later.",
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
        }

        setLoader(false);
      });
    } catch (error) {
      toast("Error signing up", {
        description: "Please try again later.",
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
      setLoader(false);
    }
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                  className="bg-[#323232] border-[#3e3e3e]"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="username">Username</Label>
                </div>
                <Input
                  id="username"
                  placeholder="coolcoder123"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="bg-[#323232] border-[#3e3e3e]"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-[#323232] border-[#3e3e3e]"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-[#323232] border-[#3e3e3e]"
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
                  <span className="text-leetcode-primary hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-leetcode-primary hover:underline">
                    Privacy Policy
                  </span>
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-leetcode-primary hover:bg-leetcode-primary/90 cursor-pointer"
                disabled={loader || guestLoader}
              >
                {loader ? (
                  <div className=" flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>Create Account</>
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
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-leetcode-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>

          <CardFooter className="flex flex-col space-y-2">
            <span>or</span>
            <Button
              onClick={() => {
                signIn("google", {
                  callbackUrl: "/",
                });
              }}
              className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-violet-600 font-semibold"
              disabled={loader || guestLoader}
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
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SignupPage;
