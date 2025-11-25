'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          {/* Icône d'annulation */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold mb-2">Paiement annulé</h1>
          <p className="text-muted-foreground mb-8">
            Vous avez annulé le processus de paiement. Aucun montant n'a été
            débité.
          </p>

          {/* Suggestions */}
          <div className="bg-muted p-6 rounded-lg mb-8 text-left">
            <h3 className="font-semibold mb-2">Que faire maintenant ?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • Vous pouvez retourner sur la page du cours et réessayer
              </li>
              <li>• Vérifier que votre carte bancaire est valide</li>
              <li>
                • Contacter le support si vous rencontrez des problèmes
              </li>
            </ul>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Retour
            </Button>
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto">
                Voir les cours
              </Button>
            </Link>
          </div>

          {/* Lien support */}
          <p className="text-sm text-muted-foreground mt-8">
            Besoin d'aide ?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contactez le support
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
