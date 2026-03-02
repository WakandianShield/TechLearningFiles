'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/lib/api';
import { sanitizeText } from '@/lib/sanitize';
import { Loader2, Globe, Lock } from 'lucide-react';
import { getCategoryLabel } from '@/lib/utils';

const CATEGORIES = ['PROGRAMMING', 'MATH', 'SCIENCE', 'DESIGN', 'WRITING', 'RESEARCH', 'PRESENTATION', 'LAB', 'OTHER'];

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'OTHER',
    tags: '',
    semester: '',
    subject: '',
    visibility: 'PUBLIC',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tagsArray = form.tags
        .split(',')
        .map((t) => sanitizeText(t).trim())
        .filter(Boolean);

      const res = await createProject({
        title: sanitizeText(form.title).trim(),
        description: sanitizeText(form.description).trim() || undefined,
        category: form.category,
        tags: tagsArray,
        semester: sanitizeText(form.semester).trim() || undefined,
        subject: sanitizeText(form.subject).trim() || undefined,
        visibility: form.visibility,
      });

      router.push(`/dashboard/projects/${res.data.id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear el proyecto.';
      setError(typeof message === 'string' ? message : message.join(', '));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <h1 className="text-2xl font-bold gradient-text mb-6">Nuevo Proyecto</h1>

      <div className="card p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título del proyecto *
            </label>
            <input
              name="title"
              type="text"
              className="input"
              placeholder="Ej: Proyecto Final de Estructuras de Datos"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              className="input"
              rows={3}
              placeholder="Describe brevemente tu proyecto..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Categoría
              </label>
              <select
                name="category"
                className="input"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Semestre
              </label>
              <input
                name="semester"
                type="text"
                className="input"
                placeholder="Ej: 2025-2"
                value={form.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Materia / Asignatura
            </label>
            <input
              name="subject"
              type="text"
              className="input"
              placeholder="Ej: Ciencias de la Computación 201"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags (separados por coma)
            </label>
            <input
              name="tags"
              type="text"
              className="input"
              placeholder="Ej: algoritmos, java, árboles"
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          {/* Visibility selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visibilidad
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, visibility: 'PUBLIC' })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                  form.visibility === 'PUBLIC'
                    ? 'bg-accent-green/10 border-accent-green/40 text-accent-green'
                    : 'bg-dark-800/50 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Público</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, visibility: 'PRIVATE' })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                  form.visibility === 'PRIVATE'
                    ? 'bg-gray-500/10 border-gray-400/40 text-gray-300'
                    : 'bg-dark-800/50 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Privado</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1.5">
              {form.visibility === 'PUBLIC'
                ? 'Cualquier persona podrá ver este proyecto en Explorar.'
                : 'Solo tú podrás ver este proyecto.'}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
