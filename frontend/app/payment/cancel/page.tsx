import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="flex justify-center w-full">
            <XIcon className="size-12 text-red-500 bg-red-500/30 p-3 rounded-full" />
          </div>
          <div className="mt-3 text-center">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight">
              No worries, you wont be charged. Please try again.
            </p>
            <Link
              href="/"
              className={buttonVariants({ className: "mt-3 w-full" })}
            >
              <ArrowLeft className="size-4" />
              Go back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
