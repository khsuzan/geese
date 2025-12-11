export interface ApiRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  description?: string;
  headers?: Record<string, string>;
  body?: string;
  params?: Record<string, string>;
}

export interface ApiFolder {
  id: string;
  name: string;
  requests: ApiRequest[];
  subfolders: ApiFolder[];
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}
