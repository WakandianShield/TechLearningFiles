'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Loader2 } from 'lucide-react';
import { sanitizeText } from '@/lib/sanitize';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const sanitizedEmail = sanitizeText(email).trim();

    const result = await signIn('credentials', {
      redirect: false,
      email: sanitizedEmail,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Credenciales inválidas. Intenta de nuevo.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1a24 100%)' }}>
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <BookOpen className="h-10 w-10 text-accent-cyan" />
            <span className="text-2xl font-bold gradient-text">TechLearning</span>
          </Link>
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-accent-cyan hover:text-accent-cyan/80 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
