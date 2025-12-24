"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUpdateLessonMutation } from "@/lib/generated/graphql";
import { VideoSourceSelector } from "./VideoSourceSelector";

// Schema de validation
const lessonSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  videoKey: z.string().optional(),
  externalVideoUrl: z.string().optional(),
  duration: z.number().optional(),
  isFree: z.boolean(),
});

type LessonFormValues = z.infer<typeof lessonSchema>;

interface LessonFormCompleteProps {
  lesson: {
    id: string;
    title: string;
    description?: string | null;
    videoUrl?: string | null;
    videoKey?: string | null;
    duration?: number | null;
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

export function LessonFormComplete({
  lesson,
  courseId,
  chapterId,
}: LessonFormCompleteProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [updateLesson, { loading }] = useUpdateLessonMutation();

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      videoKey: lesson.videoKey || "",
      externalVideoUrl: lesson.externalVideoUrl || "",
      duration: lesson.duration || undefined,
      isFree: lesson.isFree || false,
    },
  });

  // Mettre à jour les valeurs quand la lesson change
  useEffect(() => {
    form.reset({
      title: lesson.title || "",
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      videoKey: lesson.videoKey || "",
      externalVideoUrl: lesson.externalVideoUrl || "",
      duration: lesson.duration || undefined,
      isFree: lesson.isFree || false,
    });
  }, [lesson, form]);

  const onSubmit = async (values: LessonFormValues) => {
    try {
      await updateLesson({
        variables: {
          id: lesson.id,
          input: {
            title: values.title,
            description: values.description || null,
            videoUrl: values.videoUrl || null,
            videoKey: values.videoKey || null,
            externalVideoUrl: values.externalVideoUrl || null,
            duration: values.duration || null,
            isFree: values.isFree,
          },
        },
      });

      toast({
        title: "✅ Lesson mise à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });

      // Rediriger vers la page d'édition du cours
      router.push(`/admin/courses/${courseId}/edit`);
      router.refresh();
    } catch (error: any) {
      console.error("Update lesson error:", error);
      toast({
        title: "❌ Erreur",
        description: error.message || "Impossible de mettre à jour la lesson",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la lesson *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Introduction à React"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez brièvement ce que les étudiants vont apprendre..."
                      rows={3}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Une brève description de la lesson
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Video Section */}
        <Card>
          <CardHeader>
            <CardTitle>🎥 Vidéo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Source */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Source de la vidéo</FormLabel>
                  <FormControl>
                    <VideoSourceSelector
                      videoUrl={form.watch("videoUrl") || ""}
                      videoKey={form.watch("videoKey") || ""}
                      externalVideoUrl={form.watch("externalVideoUrl") || ""}
                      onChange={(data) => {
                        form.setValue("videoUrl", data.videoUrl || "");
                        form.setValue("videoKey", data.videoKey || "");
                        form.setValue("externalVideoUrl", data.externalVideoUrl || "");
                      }}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Uploadez une vidéo MP4/WebM (max 2GB) ou collez une URL YouTube/Vimeo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée (en secondes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="300"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      value={field.value || ""}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Durée approximative de la vidéo (ex: 300 = 5 minutes)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Paramètres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Free Lesson */}
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Lesson gratuite
                    </FormLabel>
                    <FormDescription>
                      Cette lesson sera accessible sans inscription au cours
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
