import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session && (session as any).accessToken) {
      config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
    }
  }
  return config;
});

// Auth
export const registerUser = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const getMe = () => api.get('/auth/me');

// Projects
export const getProjects = (category?: string) =>
  api.get('/projects', { params: category ? { category } : {} });

export const getProject = (id: string) => api.get(`/projects/${id}`);

export const createProject = (data: {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  semester?: string;
  subject?: string;
  visibility?: string;
}) => api.post('/projects', data);

export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data);

export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

export const togglePinProject = (id: string) => api.patch(`/projects/${id}/pin`);

export const getProjectStats = () => api.get('/projects/stats');

// Explore (public)
export const exploreProjects = (params?: { category?: string; search?: string }) =>
  api.get('/projects/explore', { params });

export const getPublicProject = (id: string) => api.get(`/projects/public/${id}`);

// Files
export const uploadFiles = (projectId: string, files: File[], description?: string) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  if (description) formData.append('description', description);

  return api.post(`/files/upload/${projectId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getProjectFiles = (projectId: string, fileType?: string) =>
  api.get(`/files/project/${projectId}`, { params: fileType ? { fileType } : {} });

export const deleteFile = (fileId: string) => api.delete(`/files/${fileId}`);

export const renameFile = (fileId: string, displayName: string) =>
  api.patch(`/files/${fileId}/rename`, { displayName });

// Profile
export const getProfile = () => api.get('/users/profile');

export const updateProfile = (data: { name?: string; bio?: string; website?: string; socialLinks?: Record<string, string> }) =>
  api.put('/users/profile', data);

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadBanner = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/users/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Public profiles & search
export const getPublicProfile = (userId: string) => api.get(`/users/${userId}/public`);

export const getPublicUserProjects = (userId: string, category?: string) =>
  api.get(`/users/${userId}/projects`, { params: category ? { category } : {} });

export const searchUsers = (query: string) =>
  api.get('/users/search', { params: { q: query } });

export default api;
