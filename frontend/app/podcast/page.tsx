"use client";

import { PodcastCard } from "./_components/podcast-card";

const samplePodcasts = [
  {
    id: "1",
    title: "L'avenir de l'Intelligence Artificielle",
    description:
      "Une discussion approfondie sur les dernières avancées en IA et leur impact sur notre société. Nous explorons les opportunités et les défis qui nous attendent.",
    duration: "45 min",
    publishDate: "2024-01-15",

    audioUrl: "/audio/podcast-1.mp3",
    host: {
      name: "David-Alexandre EKLO",
      avatar: "/placeholder.png?height=40&width=40",
    },
    category: "Technologie",
    isNew: true,
  },
  {
    id: "2",
    title: "Management et Innovation",
    description:
      "Rencontre avec des managers qui révolutionnent leur secteur. Découvrez leurs secrets et leurs stratégies pour réussir.",
    duration: "38 min",
    publishDate: "2024-01-12",
    /*     imageUrl: "/placeholder.png?height=300&width=400", */
    audioUrl: "/audio/podcast-2.mp3",
    host: {
      name: "Franck",
      avatar: "/placeholder.png?height=40&width=40",
    },
    category: "Business",
  },
  {
    id: "3",
    title: "Développement Personnel et Bien-être",
    description:
      "Conseils pratiques pour améliorer votre quotidien et atteindre vos objectifs personnels et professionnels.",
    duration: "52 min",
    publishDate: "2024-01-10",

    audioUrl: "/audio/podcast-3.mp3",
    host: {
      name: "Hind",
      avatar: "/placeholder.png?height=40&width=40",
    },
    category: "Développement",
  },
  {
    id: "4",
    title: "Terraform : Maîtriser l'Infrastructure as Code",
    description:
      "Découvrez comment Terraform révolutionne la gestion d'infrastructure. De la création de ressources AWS à la gestion multi-cloud, apprenez les bonnes pratiques, les modules réutilisables et les stratégies de déploiement pour automatiser votre infrastructure en toute sécurité.",
    duration: "41 min",
    publishDate: "2024-01-08",

    audioUrl: "/audio/podcast-4.mp3",
    host: {
      name: "Ayindé Louisin",
      avatar: "/placeholder.png?height=40&width=40",
    },
    category: "Culture",
  },
];

export default function PodcastPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nos Podcasts</h1>
        <p className="text-muted-foreground">
          Découvrez notre collection de podcasts sur des sujets variés et
          passionnants.
        </p>
      </div>

      {/* Podcast en vedette */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">À la une</h2>
        <PodcastCard
          {...samplePodcasts[0]}
          variant="featured"
          className="max-w-2xl"
        />
      </section>

      {/* Liste des podcasts - Vue par défaut */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Tous les épisodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePodcasts.map((podcast) => (
            <PodcastCard key={podcast.id} {...podcast} variant="default" />
          ))}
        </div>
      </section>

      {/* Liste compacte */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Écoute rapide</h2>
        <div className="space-y-4">
          {samplePodcasts.map((podcast) => (
            <PodcastCard
              key={`compact-${podcast.id}`}
              {...podcast}
              variant="compact"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
