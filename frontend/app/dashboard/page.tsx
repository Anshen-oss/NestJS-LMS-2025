import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { PublicCourseCard } from "../(publicRoutes)/_components/PublicCourseCard";
import Link from "next/link";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to.
        </p>
      </div>
      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No Courses purchase"
          description="You have not purchase any courses yet."
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard data={course} key={course.Course.id} />
          ))}
        </div>
      )}
      {/* Section : Available Courses*/}
      <section className="mt-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses you can purchase.
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No Courses available"
            description="You have already purchase all available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard data={course} key={course.id} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
