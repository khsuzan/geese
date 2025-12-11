import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  FolderOpen,
  Clock,
  MoreVertical,
  Trash2,
  Edit,
  Search,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  apiCount: number;
  color: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce API",
      description: "REST API for online shopping platform",
      createdAt: "2024-12-01",
      apiCount: 24,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Authentication Service",
      description: "OAuth2 and JWT authentication endpoints",
      createdAt: "2024-11-28",
      apiCount: 12,
      color: "bg-purple-500",
    },
    {
      id: "3",
      name: "Payment Gateway",
      description: "Stripe and PayPal integration APIs",
      createdAt: "2024-11-15",
      apiCount: 8,
      color: "bg-green-500",
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDescription,
      createdAt: new Date().toISOString().split("T")[0],
      apiCount: 0,
      color: randomColor,
    };

    setProjects([newProject, ...projects]);
    setNewProjectName("");
    setNewProjectDescription("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/api-list?project=${projectId}`);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Projects
              </h1>
              <p className="text-muted-foreground">
                Manage and organize your API collections
              </p>
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size="xl" className="rounded-full">
                  <Plus size={20} />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Create a new project to organize your API collections
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Project Name</Label>
                    <Input
                      id="name"
                      placeholder="My Awesome Project"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateProject();
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Describe your project..."
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="rounded-full"
                    size="lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProject}
                    className="rounded-full"
                    size="lg"
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-auto p-8">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-6 p-6 rounded-full bg-muted">
              <FolderOpen size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Create your first project to start organizing your API collections"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="xl"
                className="rounded-full"
              >
                <Plus size={20} />
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50"
                onClick={() => handleOpenProject(project.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-lg ${project.color} flex items-center justify-center shadow-lg`}
                    >
                      <FolderOpen size={24} className="text-white" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add edit functionality
                          }}
                        >
                          <Edit size={16} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 size={16} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl mt-3">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-10">
                    {project.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between pt-0 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FolderOpen size={14} />
                    <span>{project.apiCount} APIs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{project.createdAt}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
