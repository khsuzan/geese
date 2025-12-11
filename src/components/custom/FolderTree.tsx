import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiFolder, ApiRequest } from "../../types/api";
import { Button } from "../ui/button";

interface FolderTreeProps {
  folders: ApiFolder[];
  onSelectRequest: (request: ApiRequest) => void;
  selectedRequestId?: string;
}

interface FolderNodeProps {
  folder: ApiFolder;
  onSelectRequest: (request: ApiRequest) => void;
  selectedRequestId?: string;
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700 border-blue-200",
  POST: "bg-green-100 text-green-700 border-green-200",
  PUT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PATCH: "bg-purple-100 text-purple-700 border-purple-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
};

function FolderNode({
  folder,
  onSelectRequest,
  selectedRequestId,
}: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="select-none mb-1">
      <div
        className="flex items-center px-3 py-2.5 hover:bg-accent cursor-pointer rounded-md transition-colors group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown
            size={16}
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          />
        ) : (
          <ChevronRight
            size={16}
            className="text-muted-foreground group-hover:text-foreground transition-colors"
          />
        )}
        <Folder size={16} className="ml-2 text-primary" />
        <span className="ml-2 text-sm font-medium text-foreground">
          {folder.name}
        </span>
      </div>

      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {folder.requests.map((request) => {
            const isSelected = selectedRequestId === request.id;
            return (
              <div
                key={request.id}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-md transition-all group",
                  isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent border border-transparent",
                )}
                onClick={() => onSelectRequest(request)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText
                    size={14}
                    className={
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    }
                  />
                  <span
                    className={cn(
                      "text-sm truncate",
                      isSelected
                        ? "font-medium text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {request.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded border ml-2 shrink-0",
                    methodColors[request.method] ||
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {request.method}
                </span>
              </div>
            );
          })}
          {folder.subfolders.map((subfolder) => (
            <FolderNode
              key={subfolder.id}
              folder={subfolder}
              onSelectRequest={onSelectRequest}
              selectedRequestId={selectedRequestId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree({
  folders,
  onSelectRequest,
  selectedRequestId,
}: FolderTreeProps) {
  return (
    <div className="w-72 bg-card border-r overflow-y-auto">
      <div className="flex flex-row justify-between items-center p-4 border-b bg-muted/30">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          API Requests
        </h3>
        <Button variant="secondary" className="p-0 px-2 h-6">
          New Folder
        </Button>
      </div>
      <div className="p-3">
        {folders.length === 0 ? (
          <p className="text-xs text-muted-foreground italic px-3 py-2">
            No requests yet
          </p>
        ) : (
          folders.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              onSelectRequest={onSelectRequest}
              selectedRequestId={selectedRequestId}
            />
          ))
        )}
      </div>
    </div>
  );
}
