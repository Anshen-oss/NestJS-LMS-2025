import { EmptyState } from "@/components/general/EmptyState";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your learning dashboard!
        </p>
      </div>

      <EmptyState
        title="Dashboard en cours de migration"
        description="Le dashboard complet sera disponible après la migration GraphQL. Pour l'instant, vous pouvez tester la navigation et le logout."
        buttonText="Browse Courses"
        href="/courses"
      />
    </div>
  );
}
