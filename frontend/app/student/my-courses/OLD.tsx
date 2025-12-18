import { Navbar } from '@/app/(publicRoutes)/_components/Navbar';

export default function MyCoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
