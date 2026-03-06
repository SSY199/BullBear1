"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmail } from "@/lib/actions/auth.actions";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FooterLink from "@/forms/FooterLink";

export default function SignInPage() {
  const router = useRouter();
  
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await signInWithEmail(data.email, data.password);
      
      if (res.success) {
        toast.success("Successfully signed in!");
        router.push("/dashboard");
      } else {
        toast.error(res.message || "Failed to sign in.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden p-4">
      {/* Emerald Glow Background */}
      <div className="absolute top-1/4 left-1/4 w-100 h-100 rounded-full blur-[120px] mix-blend-screen bg-emerald-600/20 pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 bg-zinc-950/50 backdrop-blur-xl border-zinc-800 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-zinc-100">
            Welcome Back.
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your credentials to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                className="bg-zinc-900 border-zinc-800 text-zinc-100"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-xs text-red-400">
                  {errors.email.message as string}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs text-zinc-400 hover:text-white"
                  type="button"
                >
                  Forgot?
                </Button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-zinc-900 border-zinc-800 text-zinc-100"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="text-xs text-red-400">
                  {errors.password.message as string}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2 bg-zinc-100 text-zinc-900 hover:bg-zinc-300"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Access Dashboard
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zinc-800 pt-6">
          {/* Replaced the standard Link with your custom FooterLink component */}
          <FooterLink
            text="Don't have an account?"
            linkText="Sign Up"
            href="/sign-up"
          />
        </CardFooter>
      </Card>
    </div>
  );
}