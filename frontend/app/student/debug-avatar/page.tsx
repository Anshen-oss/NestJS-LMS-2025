'use client';

import { Avatar } from '@/components/ui/avatar';
import { useGetCurrentUserQuery } from '@/lib/generated/graphql';
import { useEffect, useState } from 'react';

/**
 * PAGE DE DEBUG PURE
 * Affiche exactement ce qu'on reçoit du serveur
 */
export default function DebugAvatarPage() {
  const { data, loading, refetch } = useGetCurrentUserQuery();
  const user = data?.getCurrentUser;

  const [userAvatar, setUserAvatar] = useState<string | undefined>();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog(`🔍 useEffect déclenché`);
    addLog(`user exists: ${!!user}`);
    addLog(`user?.image: ${user?.image}`);
    addLog(`userAvatar state: ${userAvatar}`);

    if (user?.image) {
      addLog(`✅ Trouvé user.image: ${user.image}`);
      setUserAvatar(user.image);
      addLog(`✅ setUserAvatar appelé avec: ${user.image}`);
    } else {
      addLog(`❌ user.image est vide ou undefined`);
    }
  }, [user?.image]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">🔍 DEBUG AVATAR</h1>

      {/* SECTION 1: Les données du serveur */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold mb-4">📡 Données du Serveur</h2>

        <div className="space-y-2 font-mono text-sm">
          <div>
            <span className="font-bold">Loading:</span> {loading ? '⏳ TRUE' : '✅ FALSE'}
          </div>
          <div>
            <span className="font-bold">user exists:</span> {user ? '✅ YES' : '❌ NO'}
          </div>
          <div>
            <span className="font-bold">user.id:</span> {user?.id || 'undefined'}
          </div>
          <div>
            <span className="font-bold">user.name:</span> {user?.name || 'undefined'}
          </div>
          <div className="bg-yellow-100 p-2 rounded">
            <span className="font-bold">user.image:</span> {user?.image ? '✅ EXISTS' : '❌ MISSING'}
            <br />
            <span className="text-xs break-all">{user?.image || '(undefined)'}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: L'état local */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-bold mb-4">💾 État Local (React)</h2>

        <div className="space-y-2 font-mono text-sm">
          <div className="bg-green-100 p-2 rounded">
            <span className="font-bold">userAvatar state:</span> {userAvatar ? '✅ HAS VALUE' : '❌ EMPTY'}
            <br />
            <span className="text-xs break-all">{userAvatar || '(undefined)'}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: L'Avatar affiché */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h2 className="text-xl font-bold mb-4">🖼️ Avatar Rendu</h2>

        <div className="flex flex-col items-center gap-4">
          {userAvatar ? (
            <>
              <Avatar
                src={userAvatar}
                name={user?.name || 'User'}
                size="lg"
              />
              <div className="text-sm text-green-700">
                ✅ Avatar devrait s'afficher avec l'URL:
                <br />
                <span className="font-mono text-xs break-all">{userAvatar}</span>
              </div>
            </>
          ) : (
            <div className="text-sm text-red-700">
              ❌ userAvatar est vide! Avatar affichera les initiales
              <br />
              <Avatar
                src={undefined}
                name={user?.name || 'User'}
                size="lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4: Les logs */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">📋 Logs (useEffect)</h2>

        <div className="space-y-1 font-mono text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-auto max-h-48">
          {logs.length === 0 ? (
            <div className="text-gray-500">Pas de logs encore...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>

      {/* SECTION 5: Boutons debug */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 space-y-3">
        <h2 className="text-xl font-bold mb-4">🔧 Actions Debug</h2>

        <button
          onClick={() => {
            addLog(`🔄 Refetch manuel`);
            refetch().then(() => {
              addLog(`✅ Refetch terminé`);
            });
          }}
          className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refetch les données
        </button>

        <button
          onClick={() => {
            addLog(`🧹 Effacer les logs`);
            setLogs([]);
          }}
          className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Effacer les logs
        </button>

        <button
          onClick={() => {
            addLog(`📋 Copier user.image`);
            if (user?.image) {
              navigator.clipboard.writeText(user.image);
              addLog(`✅ Copié: ${user.image}`);
            }
          }}
          className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Copier l'URL de l'image
        </button>
      </div>
    </div>
  );
}
