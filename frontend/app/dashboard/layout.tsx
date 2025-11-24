import { Navbar } from "@/app/(publicRoutes)/_components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 flex-1">
        {children}
      </main>
    </div>
  );
}
