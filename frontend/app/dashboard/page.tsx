import { DashboardEnrollments } from './_components/DashboardEnrollments';


export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mon Dashboard</h1>
        <p className="text-muted-foreground">
          Gérez vos cours et suivez votre progression
        </p>
      </div>

      <DashboardEnrollments />
    </div>
  );
}
