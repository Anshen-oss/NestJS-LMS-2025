'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Confirmation de votre paiement...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center">
          {/* Icône de succès */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold mb-2">Paiement réussi !</h1>
          <p className="text-muted-foreground mb-8">
            Merci pour votre achat. Vous êtes maintenant inscrit au cours !
          </p>

          {/* Session ID (optionnel) */}
          {sessionId && (
            <div className="bg-muted p-4 rounded-lg mb-8">
              <p className="text-sm text-muted-foreground">
                ID de session : <code className="text-xs">{sessionId}</code>
              </p>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Accéder à mes cours
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Découvrir plus de cours
              </Button>
            </Link>
          </div>

          {/* Note */}
          <p className="text-sm text-muted-foreground mt-8">
            Un email de confirmation a été envoyé à votre adresse.
          </p>
        </div>
      </Card>
    </div>
  );
}
