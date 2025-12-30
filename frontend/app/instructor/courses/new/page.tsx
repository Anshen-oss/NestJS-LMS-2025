'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCourse } from '@/hooks/use-create-course';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '@/lib/constants/course-constants';
import { ArrowLeft, BookOpen, DollarSign, Layers, Loader2, Sparkles, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function NewCoursePage() {
  const { createCourse, loading } = useCreateCourse();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    smallDescription: '',
    description: '',
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    price: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!formData.smallDescription.trim()) {
      newErrors.smallDescription = 'La description courte est requise';
    } else if (formData.smallDescription.length < 10) {
      newErrors.smallDescription = 'La description courte doit contenir au moins 10 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.price) {
      newErrors.price = 'Le prix est requis';
    } else if (parseFloat(formData.price) < 0) {
      newErrors.price = 'Le prix doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await createCourse({
      title: formData.title.trim(),
      smallDescription: formData.smallDescription.trim(),
      description: formData.description.trim(),
      category: formData.category,
      level: formData.level,
      price: parseFloat(formData.price),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6 hover:bg-white/50">
            <Link href="/instructor/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux cours
            </Link>
          </Button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Créer un Nouveau Cours
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              Partagez vos connaissances avec le monde entier ✨
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre du cours */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Donnez un nom à votre cours</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Choisissez un titre accrocheur qui capte l'attention 🎯
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="title" className="text-lg font-semibold text-gray-900">
                  Titre du cours <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ex: Maîtriser TypeScript en 2025 🚀"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`text-lg h-14 ${errors.title ? 'border-red-500 border-2' : 'border-gray-300'}`}
                  disabled={loading}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    ⚠️ {errors.title}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Descriptions */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Présentez votre cours</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Expliquez ce que les étudiants vont apprendre 📚
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description courte */}
              <div className="space-y-3">
                <Label htmlFor="smallDescription" className="text-lg font-semibold text-gray-900">
                  Accroche (Description courte) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smallDescription"
                  placeholder="Ex: Apprenez TypeScript de A à Z avec des projets concrets 💻"
                  value={formData.smallDescription}
                  onChange={(e) => handleChange('smallDescription', e.target.value)}
                  className={`text-base h-12 ${errors.smallDescription ? 'border-red-500 border-2' : 'border-gray-300'}`}
                  disabled={loading}
                  maxLength={150}
                />
                <div className="flex justify-between items-center">
                  {errors.smallDescription ? (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      ⚠️ {errors.smallDescription}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Cette description apparaîtra sur la carte du cours</p>
                  )}
                  <p className={`text-sm font-medium ${formData.smallDescription.length > 140 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {formData.smallDescription.length}/150
                  </p>
                </div>
              </div>

              {/* Description complète */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-lg font-semibold text-gray-900">
                  Description détaillée <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez en détail ce que les étudiants apprendront, les compétences qu'ils acquerront, et pourquoi ce cours est unique... 🌟"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`text-base min-h-[160px] ${errors.description ? 'border-red-500 border-2' : 'border-gray-300'}`}
                  disabled={loading}
                  rows={8}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    ⚠️ {errors.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Catégorie et Niveau */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Classification du cours</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Aidez les étudiants à trouver votre cours 🔍
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catégorie */}
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-lg font-semibold text-gray-900">
                    Catégorie <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className={`h-12 text-base ${errors.category ? 'border-red-500 border-2' : 'border-gray-300'}`}>
                      <SelectValue placeholder="Choisir une catégorie 📁" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                      ⚠️ {errors.category}
                    </p>
                  )}
                </div>

                {/* Niveau */}
                <div className="space-y-3">
                  <Label htmlFor="level" className="text-lg font-semibold text-gray-900">
                    Niveau de difficulté <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleChange('level', value as any)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12 text-base border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prix */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"></div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-900">Fixez votre tarif</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Définissez le prix de votre expertise 💰
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor="price" className="text-lg font-semibold text-gray-900">
                  Prix du cours (USD) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-600">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className={`pl-12 text-2xl font-bold h-16 ${errors.price ? 'border-red-500 border-2' : 'border-gray-300'}`}
                    disabled={loading}
                  />
                </div>
                {errors.price ? (
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    ⚠️ {errors.price}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    💡 Astuce : Vous pourrez toujours modifier le prix plus tard
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={loading}
              size="lg"
              className="text-base px-8 h-14 text-black"
            >
              <Link href="/instructor/courses">
                Annuler
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="text-base px-8 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Créer mon cours
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info card */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">🎯 Prochaines étapes après la création</h3>
                <ul className="space-y-2 text-base text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Vous serez redirigé vers la page d'édition du cours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Ajoutez des chapitres et des leçons pour structurer votre contenu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">3.</span>
                    <span>Uploadez une image de couverture attractive</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">4.</span>
                    <span>Le cours restera en mode "Brouillon" jusqu'à publication</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
