'use client';

import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { sanitizeText } from '@/lib/sanitize';
import { Loader2, User, Mail, Calendar, FolderOpen } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setProfile(res.data);
        setName(res.data.name || '');
        setBio(res.data.bio || '');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateProfile({
        name: sanitizeText(name).trim(),
        bio: sanitizeText(bio).trim(),
      });
      setMessage('Perfil actualizado correctamente.');
    } catch (error) {
      setMessage('Error al actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      {/* Profile info */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {profile?.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Desde {profile?.createdAt && format(new Date(profile.createdAt), "MMMM yyyy", { locale: es })}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
          <FolderOpen className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-700">
            <strong>{profile?._count?.projects || 0}</strong> proyectos creados
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Perfil</h3>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes('Error')
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Cuéntanos un poco sobre ti..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
