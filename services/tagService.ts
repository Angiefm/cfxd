import { apiClient } from "@/lib/api";

export interface Tag {
  id: string;
  name: string;
}

export interface TagsResponse {
  success: boolean;
  status: "success" | "error";
  data: {
    tags: Tag[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CreateTagResponse {
  status: "success" | "error";
  message: string;
  data: Tag;
}

export async function getTags(params?: {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}): Promise<TagsResponse> {
  const queryParams = new URLSearchParams();

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

  const queryString = queryParams.toString();
  const url = `/api/tags${queryString ? `?${queryString}` : ''}`;

  return await apiClient.get(url);
}

export async function createTag(name: string): Promise<CreateTagResponse> {
  return await apiClient.post("/api/tags", { name });
}
