'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Upload, FolderOpen, Shield, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1a24 100%)' }}>
      {/* Header */}
      <header style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container-app">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={32} style={{ color: 'var(--accent-cyan)' }} />
              <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700 }}>TechLearning</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/explore" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
                Explorar
              </Link>
              <Link href="/auth/login" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="btn-primary" style={{ fontSize: '0.875rem' }}>
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container-app" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="animate-fade-in-up" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(100,255,218,0.1)',
            border: '1px solid rgba(100,255,218,0.2)',
            color: 'var(--accent-cyan)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} />
            Plataforma de archivos académicos
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 3.75rem)', fontWeight: 800, color: 'var(--gray-100)' }}>
            Tu Journey
            <span className="gradient-text"> Académico</span>
          </h1>
          <p style={{ marginTop: '1.5rem', fontSize: '1.25rem', color: 'var(--gray-400)', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Organiza, guarda y gestiona todos tus proyectos académicos en un solo lugar.
            PDFs, documentos, videos, fotos y cualquier tipo de archivo.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
              Comenzar Gratis
            </Link>
            <Link href="/auth/login" className="btn-secondary" style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid-responsive-4" style={{ marginTop: '6rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="icon-box icon-box-lg ib-blue" style={{ display: 'inline-flex', marginBottom: '1rem', transition: 'transform 0.3s' }}>
              <Upload size={28} style={{ color: '#60a5fa' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)' }}>Sube Todo</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              PDFs, documentos Word, videos, imágenes, código, presentaciones... cualquier archivo.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="icon-box icon-box-lg ib-green" style={{ display: 'inline-flex', marginBottom: '1rem', transition: 'transform 0.3s' }}>
              <FolderOpen size={28} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)' }}>Organiza por Proyecto</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              Agrupa archivos por materia, semestre y categoría. Lleva un journey de tu carrera.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="icon-box icon-box-lg ib-purple" style={{ display: 'inline-flex', marginBottom: '1rem', transition: 'transform 0.3s' }}>
              <Shield size={28} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)' }}>Seguro y Protegido</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              Protección con Helmet, DOMPurify y autenticación JWT. Tus archivos están seguros.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="icon-box icon-box-lg ib-cyan" style={{ display: 'inline-flex', marginBottom: '1rem', transition: 'transform 0.3s' }}>
              <Globe size={28} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-100)' }}>Comparte y Explora</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
              Haz públicos tus proyectos y descubre lo que otros comparten en la comunidad.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '5rem' }}>
        <div className="container-app" style={{ paddingTop: '2rem', paddingBottom: '2rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} TechLearning. Academic Files Journey Platform.
        </div>
      </footer>
    </div>
  );
}
