/**
 * Catégories disponibles pour les cours
 * Peut être facilement étendu en ajoutant de nouvelles catégories
 */
export const COURSE_CATEGORIES = [
  "Programming",
  "DevOps",
  "Marketing",
  "Business",
  "IA",
  "Frontend",
] as const;

/**
 * Niveaux de difficulté des cours
 */
export const COURSE_LEVELS = [
  { value: "Beginner", label: "🌱 Débutant" },
  { value: "Intermediate", label: "🚀 Intermédiaire" },
  { value: "Advanced", label: "⚡ Avancé" },
] as const;

/**
 * Type pour les catégories de cours
 */
export type CourseCategory = typeof COURSE_CATEGORIES[number];

/**
 * Type pour les niveaux de cours
 */
export type CourseLevel = typeof COURSE_LEVELS[number]["value"];
