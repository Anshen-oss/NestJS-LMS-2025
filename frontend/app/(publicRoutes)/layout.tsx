import { Navbar } from "./_components/Navbar";

export default function LayoutPublic({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8 mb-32">
        {children}
      </main>
    </div>
  );
}
