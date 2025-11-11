import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
interface featuresProps {
  title: string;
  description: string;
  icon: string;
}

const features: featuresProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a Access carefully crafted courses by industry experts in diverse fields. range of courses covering various subjects and topics and carefully curated courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive learning",
    description:
      "Engage with interactive content, quizzes, and assigments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and experts for discussions, collaborations, and support.",
    icon: "👥",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">Revolutionizing Online Education</Badge>
          <h1 className="text-4xl md:text-6xl font bold tracking-tight">
            Empower Your Learning Potential
          </h1>
          <p className="max-w-[700] text-muted-foreground md:text-xl">
            Dive into a New Era of Education with Our Smart System. Access
            high-quality courses, anytime, anywhere
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-col md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
