// export default function NotFound() {
//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #eff6ff 100%)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '24px',
//     }}>
//       <div style={{
//         maxWidth: '600px',
//         width: '100%',
//         textAlign: 'center',
//         background: 'white',
//         padding: '48px 24px',
//         borderRadius: '24px',
//         boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
//       }}>
//         <h1 style={{
//           fontSize: '120px',
//           fontWeight: 'bold',
//           background: 'linear-gradient(to right, #9333ea, #3b82f6)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           marginBottom: '32px',
//           lineHeight: '1'
//         }}>
//           404
//         </h1>

//         <h2 style={{
//           fontSize: '36px',
//           fontWeight: 'bold',
//           color: '#111827',
//           marginBottom: '16px',
//         }}>
//           Page introuvable
//         </h2>

//         <p style={{
//           fontSize: '18px',
//           color: '#6b7280',
//           marginBottom: '48px',
//         }}>
//           Désolé, la page que vous recherchez n'existe pas.
//         </p>

//         <div style={{
//           display: 'flex',
//           gap: '16px',
//           justifyContent: 'center',
//           flexWrap: 'wrap',
//         }}>
//           <a
//             href="/"
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: '8px',
//               padding: '14px 28px',
//               backgroundColor: '#9333ea',
//               color: 'white',
//               borderRadius: '8px',
//               textDecoration: 'none',
//               fontWeight: '600',
//               fontSize: '16px',
//             }}
//           >
//             🏠 Retour à l'accueil
//           </a>

//           <a
//             href="/courses"
//             style={{
//               display: 'inline-flex',
//               alignItems: 'center',
//               gap: '8px',
//               padding: '14px 28px',
//               backgroundColor: 'white',
//               color: '#374151',
//               border: '2px solid #d1d5db',
//               borderRadius: '8px',
//               textDecoration: 'none',
//               fontWeight: '600',
//               fontSize: '16px',
//             }}
//           >
//             📚 Parcourir les cours
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


import Link from "next/link"

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">
          Cette page d'administration n'existe pas ou vous n'y avez pas accès.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
