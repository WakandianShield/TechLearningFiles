'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Loader2 } from 'lucide-react';
import { sanitizeText } from '@/lib/sanitize';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 23 23">
      <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
      <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
      <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
      <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

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

  const handleOAuthSignIn = (provider: string) => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  const dividerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1.25rem 0',
  };
  const dividerLineStyle: React.CSSProperties = {
    flex: 1,
    height: '1px',
    background: 'var(--gray-700)',
  };
  const oauthBtnStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '0.65rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid var(--gray-700)',
    background: 'var(--gray-800)',
    color: 'var(--gray-200)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1a24 100%)' }}>
      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={40} style={{ color: 'var(--accent-cyan)' }} />
            <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>TechLearning</span>
          </Link>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gray-100)', textAlign: 'center', marginBottom: '1.5rem' }}>
            Iniciar Sesión
          </h2>

          {error && (
            <div className="msg-error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              style={oauthBtnStyle}
              onClick={() => handleOAuthSignIn('google')}
              disabled={!!oauthLoading}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gray-500)'; e.currentTarget.style.background = 'var(--gray-750, #2a2a2a)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gray-700)'; e.currentTarget.style.background = 'var(--gray-800)'; }}
            >
              {oauthLoading === 'google' ? <Loader2 size={20} className="animate-spin" /> : <GoogleIcon />}
              Continuar con Google
            </button>
            <button
              type="button"
              style={oauthBtnStyle}
              onClick={() => handleOAuthSignIn('github')}
              disabled={!!oauthLoading}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gray-500)'; e.currentTarget.style.background = 'var(--gray-750, #2a2a2a)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gray-700)'; e.currentTarget.style.background = 'var(--gray-800)'; }}
            >
              {oauthLoading === 'github' ? <Loader2 size={20} className="animate-spin" /> : <GitHubIcon />}
              Continuar con GitHub
            </button>
            <button
              type="button"
              style={oauthBtnStyle}
              onClick={() => handleOAuthSignIn('azure-ad')}
              disabled={!!oauthLoading}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gray-500)'; e.currentTarget.style.background = 'var(--gray-750, #2a2a2a)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gray-700)'; e.currentTarget.style.background = 'var(--gray-800)'; }}
            >
              {oauthLoading === 'azure-ad' ? <Loader2 size={20} className="animate-spin" /> : <MicrosoftIcon />}
              Continuar con Microsoft
            </button>
          </div>

          {/* Divider */}
          <div style={dividerStyle}>
            <div style={dividerLineStyle} />
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>o</span>
            <div style={dividerLineStyle} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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

            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled={loading}>
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-400)' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
