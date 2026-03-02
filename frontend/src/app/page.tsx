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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1a24 100%)' }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-dark-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-accent-cyan" />
              <span className="text-xl font-bold gradient-text">TechLearning</span>
            </div>
            <div className="flex gap-3">
              <Link href="/explore" className="btn-secondary text-sm">
                Explorar
              </Link>
              <Link href="/auth/login" className="btn-secondary text-sm">
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="btn-primary text-sm">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-sm mb-6">
            <Sparkles className="h-4 w-4" />
            Plataforma de archivos académicos
          </div>
          <h1 className="text-5xl font-extrabold text-gray-100 sm:text-6xl">
            Tu Journey
            <span className="gradient-text"> Académico</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
            Organiza, guarda y gestiona todos tus proyectos académicos en un solo lugar.
            PDFs, documentos, videos, fotos y cualquier tipo de archivo.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Comenzar Gratis
            </Link>
            <Link href="/auth/login" className="btn-secondary text-lg px-8 py-3">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-4 gap-6">
          <div className="card p-8 text-center group">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-7 w-7 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Sube Todo</h3>
            <p className="mt-2 text-gray-400 text-sm">
              PDFs, documentos Word, videos, imágenes, código, presentaciones... cualquier archivo.
            </p>
          </div>

          <div className="card p-8 text-center group">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent-green/10 border border-accent-green/20 mb-4 group-hover:scale-110 transition-transform">
              <FolderOpen className="h-7 w-7 text-accent-green" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Organiza por Proyecto</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Agrupa archivos por materia, semestre y categoría. Lleva un journey de tu carrera.
            </p>
          </div>

          <div className="card p-8 text-center group">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent-purple/10 border border-accent-purple/20 mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-7 w-7 text-accent-purple" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Seguro y Protegido</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Protección con Helmet, DOMPurify y autenticación JWT. Tus archivos están seguros.
            </p>
          </div>

          <div className="card p-8 text-center group">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 mb-4 group-hover:scale-110 transition-transform">
              <Globe className="h-7 w-7 text-accent-cyan" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Comparte y Explora</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Haz públicos tus proyectos y descubre lo que otros comparten en la comunidad.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} TechLearning. Academic Files Journey Platform.
        </div>
      </footer>
    </div>
  );
}
