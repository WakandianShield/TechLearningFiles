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
    <div
      className="animate-fade-in-up"
      style={{ maxWidth: '42rem', margin: '0 auto' }}
    >
      <h1
        className="gradient-text"
        style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}
      >
        Nuevo Proyecto
      </h1>

      <div className="card" style={{ padding: '1.5rem' }}>
        {error && (
          <div className="msg-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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

          <div className="grid-responsive-2">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.25rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-300)', marginBottom: '0.5rem' }}>
              Visibilidad
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setForm({ ...form, visibility: 'PUBLIC' })}
                className={`vis-btn ${form.visibility === 'PUBLIC' ? 'vis-public' : 'vis-off'}`}
              >
                <Globe size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Público</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, visibility: 'PRIVATE' })}
                className={`vis-btn ${form.visibility === 'PRIVATE' ? 'vis-private' : 'vis-off'}`}
              >
                <Lock size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Privado</span>
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.375rem' }}>
              {form.visibility === 'PUBLIC'
                ? 'Cualquier persona podrá ver este proyecto en Explorar.'
                : 'Solo tú podrás ver este proyecto.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
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
