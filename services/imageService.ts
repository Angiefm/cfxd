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
  tags?: string[];
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
  sort_by?: string;
  sort_order?: string;
  created_from?: string;
  created_to?: string;
  tags?: string | string[];
  public?: string;
  ttl?: number;
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

  if (params?.sort_by) {
    queryParams.append('sort_by', params.sort_by);
  }

  if (params?.sort_order) {
    queryParams.append('sort_order', params.sort_order);
  }

  if (params?.created_from) {
    queryParams.append('created_from', params.created_from);
  }

  if (params?.created_to) {
    queryParams.append('created_to', params.created_to);
  }

  if (params?.tags) {
    if (Array.isArray(params.tags)) {
      queryParams.append('tags', params.tags.join(','));
    } else {
      queryParams.append('tags', params.tags);
    }
  }

  if (params?.public) {
    queryParams.append('public', params.public);
  }

  if (params?.ttl) {
    queryParams.append('ttl', params.ttl.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/images/list${queryString ? `?${queryString}` : ''}`;

  return await apiClient.get(url);
}

export async function deleteImage(imageId: string): Promise<{ message: string }> {
  return await apiClient.delete(`/api/images/${imageId}`);
}
export async function processImage(imageId: string, prompt: string, tags?: string[]): Promise<ImageData> {
  const data = { image_id: imageId, prompt, tags };
  return await apiClient.postWithExtendedTimeout("/api/images/process", data, 60000);
}