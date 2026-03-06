'use server';

import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithEmail(email: string, password: string) {
  try {
    const res = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Signin with email successful",
      data: res,
    };
  } catch (error) {
    console.log("Signin with email failed", error);
    return {
      success: false,
      message: "Signin with email failed",
      data: error,
    };
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
) {
  try {
    const res = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Sign up successful",
      data: res,
    };
  } catch (error) {
    console.log("Sign up failed", error);
    return {
      success: false,
      message: "Sign up failed",
      data: error,
    };
  }
}

export const signOut = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.log("Sign out failed", error);
    return {
      success: false,
      message: "Sign out failed",
      data: error,
    };
  }
  redirect("/sign-in");
};

export async function deleteAccount(password: string) {
  try {
    await auth.api.deleteUser({
      body: {
        password,
    },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Account deleted successfully",
    };
  } catch (error) {
    console.error("Delete account failed", error);

    return {
      success: false,
      message: "Failed to delete account",
      data: error,
    };
  }
}