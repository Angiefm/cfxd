import { apiClient } from "@/lib/api";

export interface ImageData {
  id: string;
  file_name: string;
  url: string;
  signed_url: string | null;
  mime_type: string;
  size: number;
  user_id: string;
  project_id: string | null;
  created_at: string;
}

export interface ImageListResponse {
  status: string;
  message: string | null;
  data: {
    total: number;
    page: number;
    limit: number;
    data: ImageData[];
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data: ImageData[];
}

export async function uploadImages(files: FileList, projectId?: string): Promise<UploadResponse> {
  const formData = new FormData();

  if (projectId) {
    formData.append('project_id', projectId);
  }

  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  return await apiClient.post("/api/images/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function listImages(params?: {
  project_id?: string;
  page?: number;
  limit?: number;
}): Promise<ImageListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.project_id) {
    queryParams.append('project_id', params.project_id);
  }

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }

  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/images/list${queryString ? `?${queryString}` : ''}`;

  return await apiClient.get(url);
}