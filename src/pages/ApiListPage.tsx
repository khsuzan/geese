import { useState } from "react";
import { FolderTree } from "../components/custom/FolderTree";
import { RequestPanel } from "../components/custom/RequestPanel";
import type { ApiRequest, ApiFolder, ApiResponse } from "../types/api";

export function ApiListPage() {
  const [selectedRequest, setSelectedRequest] = useState<
    ApiRequest | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  const [folders] = useState<ApiFolder[]>([
    {
      id: "folder-1",
      name: "Sample API Collection",
      requests: [
        {
          id: "req-1",
          name: "Get Users",
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/users",
          description: "Fetch all users",
        },
        {
          id: "req-2",
          name: "Create User",
          method: "POST",
          url: "https://jsonplaceholder.typicode.com/users",
          description: "Create a new user",
          body: JSON.stringify({ name: "John Doe", email: "john@example.com" }),
        },
        {
          id: "req-3",
          name: "Get User by ID",
          method: "GET",
          url: "https://jsonplaceholder.typicode.com/users/1",
          description: "Fetch a specific user",
        },
        {
          id: "req-4",
          name: "Update User",
          method: "PUT",
          url: "https://jsonplaceholder.typicode.com/users/1",
          description: "Update user information",
        },
        {
          id: "req-5",
          name: "Delete User",
          method: "DELETE",
          url: "https://jsonplaceholder.typicode.com/users/1",
          description: "Remove a user",
        },
      ],
      subfolders: [],
    },
  ]);

  const handleSendRequest = async (
    request: ApiRequest,
  ): Promise<ApiResponse | null> => {
    setIsLoading(true);
    try {
      const startTime = performance.now();
      const res = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body:
          request.body && ["POST", "PUT", "PATCH"].includes(request.method)
            ? request.body
            : undefined,
      });

      const endTime = performance.now();
      const responseBody = await res.text();

      const apiResponse: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: responseBody,
        time: Math.round(endTime - startTime),
      };

      return apiResponse;
    } catch (error) {
      const apiResponse: ApiResponse = {
        status: 0,
        statusText: "Error",
        headers: {},
        body: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        time: 0,
      };
      return apiResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-background">
      <FolderTree
        folders={folders}
        onSelectRequest={setSelectedRequest}
        selectedRequestId={selectedRequest?.id}
      />
      <RequestPanel
        request={selectedRequest}
        onSendRequest={handleSendRequest}
        isLoading={isLoading}
      />
    </div>
  );
}
