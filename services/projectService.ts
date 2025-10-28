import { apiClient } from "@/lib/api";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponse {
  total: number;
  page: number;
  limit: number;
  data: Project[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  return await apiClient.post("/api/projects", data);
}

export async function listProjects(params?: {
  page?: number;
  limit?: number;
}): Promise<ProjectListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }

  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/projects${queryString ? `?${queryString}` : ''}`;

  return await apiClient.get(url);
}

export async function getProjectById(projectId: string): Promise<Project> {
  return await apiClient.get(`/api/projects/${projectId}`);
}

export async function updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
  return await apiClient.put(`/api/projects/${projectId}`, data);
}

export async function deleteProject(projectId: string): Promise<{ message: string }> {
  return await apiClient.delete(`/api/projects/${projectId}`);
}