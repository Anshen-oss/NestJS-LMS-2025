"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignout() {
  const router = useRouter();

  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Sign out successfully");
        },
        onError: () => {
          toast.error("Sign out failed");
        },
      },
    });
  };

  return handleSignOut;
}
