import { useState } from "react";
import { Send, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApiRequest, ApiResponse } from "../../types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface RequestPanelProps {
  request?: ApiRequest;
  onSendRequest: (request: ApiRequest) => Promise<ApiResponse | null>;
  isLoading: boolean;
}

interface SavedResponse extends ApiResponse {
  savedAt: string;
  id: string;
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-600 hover:bg-blue-700",
  POST: "bg-green-600 hover:bg-green-700",
  PUT: "bg-yellow-600 hover:bg-yellow-700",
  PATCH: "bg-purple-600 hover:bg-purple-700",
  DELETE: "bg-red-600 hover:bg-red-700",
};

export function RequestPanel({
  request,
  onSendRequest,
  isLoading,
}: RequestPanelProps) {
  const [localRequest, setLocalRequest] = useState<ApiRequest>(
    request || {
      id: "",
      name: "",
      method: "GET",
      url: "",
    },
  );
  const [savedResponses, setSavedResponses] = useState<SavedResponse[]>([]);
  const [activeResponseId, setActiveResponseId] = useState<string | "latest">(
    "latest",
  );

  const handleSend = async () => {
    const response = await onSendRequest(localRequest);
    if (response) {
      const savedResponse: SavedResponse = {
        ...response,
        id: Date.now().toString(),
        savedAt: new Date().toLocaleTimeString(),
      };
      setSavedResponses([savedResponse, ...savedResponses]);
      setActiveResponseId(savedResponse.id);
    }
  };

  const handleRemoveResponse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedResponses(savedResponses.filter((r) => r.id !== id));
    if (activeResponseId === id) {
      setActiveResponseId(savedResponses[0]?.id || "latest");
    }
  };

  const activeResponse =
    activeResponseId === "latest"
      ? savedResponses[0]
      : savedResponses.find((r) => r.id === activeResponseId);

  if (!request && localRequest.id === "") {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground text-lg">
            Select a request from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Request Section */}
      <div className="flex-1 overflow-y-auto border-b">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {localRequest.name || "New Request"}
          </h2>

          {/* URL and Method */}
          <div className="flex items-stretch gap-2 mb-6">
            <Select
              value={localRequest.method}
              onValueChange={(value) =>
                setLocalRequest({
                  ...localRequest,
                  method: value as ApiRequest["method"],
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a method" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(methodColors).map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={localRequest.url}
              onChange={(e) =>
                setLocalRequest({ ...localRequest, url: e.target.value })
              }
              placeholder="Enter request URL"
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !localRequest.url}
              size="lg"
            >
              <Send size={18} />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>

          {/* Request Tabs */}
          <Tabs defaultValue="params" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="params">Params</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>
            <TabsContent value="params" className="mt-4">
              <Label className="text-sm text-muted-foreground mb-2">
                Query Parameters
              </Label>
              <Input
                type="text"
                placeholder="key=value&key2=value2"
                className="mt-2"
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-4">
              <Label className="text-sm text-muted-foreground mb-2">
                Request Headers
              </Label>
              <Input
                type="text"
                placeholder="Add headers..."
                className="mt-2"
              />
            </TabsContent>
            <TabsContent value="body" className="mt-4">
              <Label className="text-sm text-muted-foreground mb-2">
                Request Body
              </Label>
              <textarea
                placeholder="Enter JSON body..."
                className="w-full mt-2 p-3 rounded-md border bg-background text-sm font-mono min-h-[200px]"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Response Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b px-6 py-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Response</h3>
            {savedResponses.length > 0 && (
              <Badge variant="secondary">
                {savedResponses.length} saved response
                {savedResponses.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Response Tabs Sidebar */}
          {savedResponses.length > 0 && (
            <div className="w-48 border-r overflow-y-auto bg-card">
              <div className="p-2 space-y-1">
                {savedResponses.map((resp) => (
                  <button
                    key={resp.id}
                    onClick={() => setActiveResponseId(resp.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors group",
                      activeResponseId === resp.id
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-accent text-muted-foreground",
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span className="text-xs font-medium truncate">
                          {resp.savedAt}
                        </span>
                      </div>
                      <div className="text-xs mt-0.5">
                        <Badge
                          variant={
                            resp.status >= 200 && resp.status < 300
                              ? "default"
                              : "destructive"
                          }
                          className="text-[10px] px-1 py-0"
                        >
                          {resp.status}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleRemoveResponse(resp.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                    >
                      <X
                        size={12}
                        className="text-muted-foreground hover:text-destructive"
                      />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Response Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeResponse ? (
              <div>
                <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      activeResponse.status >= 200 &&
                      activeResponse.status < 300
                        ? "default"
                        : "destructive"
                    }
                  >
                    {activeResponse.status} {activeResponse.statusText}
                  </Badge>
                  <span className="text-sm text-muted-foreground ml-auto flex items-center gap-1">
                    <Clock size={14} />
                    {activeResponse.time}ms
                  </span>
                </div>
                <div className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto">
                  {activeResponse.body}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                {isLoading
                  ? "Loading..."
                  : "Response will appear here after sending a request"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
