"use client";

import { ThumbnailUpload } from "@/app/(publicRoutes)/courses/ThumbnailUpload";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CourseLevel,
  CourseStatus,
  useUpdateCourseMutation,
} from "@/lib/generated/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  smallDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
  outcomes: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").or(z.literal("")),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.number().optional(),
  status: z.enum(["Draft", "Published"]),
});

type CourseFormData = z.infer<typeof courseSchema>;

const CATEGORIES = [
  "Programming",
  "devOps",
  "Marketing",
  "Business",
  "IA",
  "Frontend",
];

interface CourseInfoTabProps {
  course: {
    id: string;
    title: string;
    smallDescription: string;
    description: string;
    requirements?: string | null;
    outcomes?: string | null;
    imageUrl?: string | null;
    price: number;
    category: string;
    level: string;
    duration?: number | null;
    status: string;
  };
}

export function CourseInfoTab({ course }: CourseInfoTabProps) {
  const router = useRouter();
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const [updateCourse, { loading: updating }] = useUpdateCourseMutation();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      smallDescription: "",
      description: JSON.stringify({ type: "doc", content: [] }),
      requirements: JSON.stringify({ type: "doc", content: [] }),
      outcomes: JSON.stringify({ type: "doc", content: [] }),
      imageUrl: "",
      price: 0,
      category: "",
      level: "Beginner",
      duration: 0,
      status: "Draft",
    },
  });

  // Initialize form with course data
  useEffect(() => {
    if (course && !isFormInitialized) {
      form.reset({
        title: course.title,
        smallDescription: course.smallDescription,
        description: course.description,
        requirements: course.requirements || JSON.stringify({ type: "doc", content: [] }),
        outcomes: course.outcomes || JSON.stringify({ type: "doc", content: [] }),
        imageUrl: course.imageUrl || "",
        price: course.price,
        category: course.category,
        level: course.level as "Beginner" | "Intermediate" | "Advanced",
        duration: course.duration || 0,
        status: course.status as "Draft" | "Published",
      });

      setIsFormInitialized(true);
    }
  }, [course, isFormInitialized, form]);

  const onSubmit = async (formData: CourseFormData) => {
    try {
      await updateCourse({
        variables: {
          input: {
            id: course.id,
            title: formData.title,
            smallDescription: formData.smallDescription,
            description: formData.description,
            requirements: formData.requirements,
            outcomes: formData.outcomes,
            imageUrl: formData.imageUrl,
            price: formData.price,
            category: formData.category,
            level: formData.level as CourseLevel,
            duration: formData.duration || null,
            status: formData.status as CourseStatus,
          },
        },
      });

      toast.success("Course updated successfully!");
    } catch (error) {
      console.error("Update course error:", error);
      toast.error("Failed to update course");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Complete NestJS Course" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="smallDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief overview of your course"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Learning Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Outcomes & Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="outcomes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What students will learn</FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle>Course Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ThumbnailUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Pricing & Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (EUR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) * 3600)
                        }
                        value={field.value ? field.value / 3600 : 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Publish Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/courses")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
