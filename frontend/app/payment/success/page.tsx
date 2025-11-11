/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessful() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex justify-center w-full">
            <CheckIcon className="size-12 text-green-500 bg-green-500/30 p-3 rounded-full" />
          </div>
          <div className="mt-3 text-center">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight">
              Congrats your payment was successful. You should now have access
              to the course
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({ className: "mt-3 w-full" })}
            >
              <ArrowLeft className="size-4" />
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
