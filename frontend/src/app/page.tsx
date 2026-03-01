'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Upload, FolderOpen, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">TechLearning</span>
            </div>
            <div className="flex gap-3">
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
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Tu Journey
            <span className="text-primary-600"> Académico</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
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
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
              <Upload className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sube Todo</h3>
            <p className="mt-2 text-gray-600">
              PDFs, documentos Word, videos, imágenes, código, presentaciones... cualquier archivo.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
              <FolderOpen className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Organiza por Proyecto</h3>
            <p className="mt-2 text-gray-600">
              Agrupa archivos por materia, semestre y categoría. Lleva un journey de tu carrera.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-4">
              <Shield className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Seguro y Protegido</h3>
            <p className="mt-2 text-gray-600">
              Protección con Helmet, DOMPurify y autenticación JWT. Tus archivos están seguros.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} TechLearning. Academic Files Journey Platform.
        </div>
      </footer>
    </div>
  );
}
