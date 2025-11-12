import axios from "axios";

export interface User {
  id: string;
  email: string;
  serviceEnabled: boolean;
}

export interface Document {
  id: string;
  google_doc_id: string;
  google_doc_url: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const auth = {
  getUser: () => api.get<User>("/auth/user"),
  logout: () => api.post("/auth/logout"),
};

export const documents = {
  create: (data: { title: string; content?: string }) =>
    api.post<Document>("/documents/create", data),
  getAll: () => api.get<Document[]>("/documents"),
  updateStatus: (id: string, data: { status: string; notes?: string }) =>
    api.patch<Document>(`/documents/${id}/status`, data),
  getHistory: (id: string) => api.get(`/documents/${id}/history`),
};

export default api;
