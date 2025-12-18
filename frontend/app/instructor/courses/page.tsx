'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  DollarSign,
  Edit,
  Eye,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function InstructorCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // TODO: Remplacer par vraies données GraphQL
  const courses = [
    {
      id: '1',
      title: 'TypeScript 2025 - Devenir expert',
      description: '2026 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imageUrl: '/placeholder-course.jpg',
      status: 'published',
      students: 67,
      revenue: 2680,
      rating: 4.8,
      reviews: 23,
      lastUpdated: '2024-12-10',
    },
    {
      id: '2',
      title: 'Node.js',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imageUrl: '/placeholder-course.jpg',
      status: 'published',
      students: 45,
      revenue: 1800,
      rating: 4.6,
      reviews: 12,
      lastUpdated: '2024-12-08',
    },
    {
      id: '3',
      title: 'Python pour les nuls',
      description: 'Le Lorem Ipsum est simplement du faux texte.',
      imageUrl: '/placeholder-course.jpg',
      status: 'draft',
      students: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      lastUpdated: '2024-12-15',
    },
  ];

  const publishedCourses = courses.filter(c => c.status === 'published');
  const draftCourses = courses.filter(c => c.status === 'draft');

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-300 mb-2">Mes Cours</h1>
            <p className="text-gray-500 text-lg">
              Gérez et organisez vos cours
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
            <Link href="/instructor/courses/new">
              <Plus className="w-5 h-5 mr-2" />
              Créer un cours
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Tous ({courses.length})
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Publiés ({publishedCourses.length})
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            Brouillons ({draftCourses.length})
          </TabsTrigger>
        </TabsList>

        {/* Tous les cours */}
        <TabsContent value="all" className="mt-6">
          {courses.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Aucun cours</h3>
                <p className="text-gray-600 mb-4">
                  Commencez par créer votre premier cours
                </p>
                <Button asChild>
                  <Link href="/instructor/courses/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer un cours
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {course.imageUrl ? (
                          <Image
                            src={course.imageUrl}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {course.status === 'draft' && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                              Brouillon
                            </span>
                          </div>
                        )}
                        {course.status === 'published' && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Publié
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {course.description}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students} étudiants
                          </span>
                          {course.status === 'published' && (
                            <>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${course.revenue}
                              </span>
                              <span className="flex items-center gap-1">
                                ⭐ {course.rating} ({course.reviews} avis)
                              </span>
                            </>
                          )}
                          <span className="text-gray-500">
                            Mis à jour le {new Date(course.lastUpdated).toLocaleDateString('fr-FR')}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-auto">
                          <Button asChild variant="default" size="sm">
                            <Link href={`/admin/courses/${course.id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Link>
                          </Button>
                          {course.status === 'published' && (
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/student/courses/${course.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Aperçu
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Publiés */}
        <TabsContent value="published" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {publishedCourses.map((course) => (
              <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <div className="absolute top-2 left-2">
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Publié
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students} étudiants
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${course.revenue}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Brouillons */}
        <TabsContent value="draft" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {draftCourses.map((course) => (
              <Card key={course.id} className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="relative w-64 h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <div className="absolute top-2 left-2">
                        <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded">
                          Brouillon
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Terminez la configuration pour publier ce cours
                      </p>
                      <Button asChild className="mt-4" size="sm">
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          Continuer l'édition
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
