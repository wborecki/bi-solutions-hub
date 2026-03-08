import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  FolderOpen,
  FileText,
  Upload,
  ArrowLeft,
  Trash2,
  Download,
  FolderPlus,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export default function Documentos() {
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Tables<"documents">[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("folder_path")
      .order("file_name");
    setDocuments(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Get folders and files at current path level
  const currentItems = documents.filter((d) => d.folder_path === currentPath);
  const subFolders = [
    ...new Set(
      documents
        .filter((d) => {
          if (!currentPath) return d.folder_path.length > 0 && !d.folder_path.includes("/");
          return (
            d.folder_path.startsWith(currentPath + "/") &&
            d.folder_path.replace(currentPath + "/", "").split("/").length === 1 &&
            d.folder_path !== currentPath
          );
        })
        .map((d) => {
          if (!currentPath) return d.folder_path.split("/")[0];
          return d.folder_path.replace(currentPath + "/", "").split("/")[0];
        })
    ),
  ].filter(Boolean);

  const breadcrumbs = currentPath ? currentPath.split("/") : [];

  const navigateTo = (folder: string) => {
    setCurrentPath(currentPath ? `${currentPath}/${folder}` : folder);
  };

  const navigateUp = () => {
    const parts = currentPath.split("/");
    parts.pop();
    setCurrentPath(parts.join("/"));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user || !profile?.company_id) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const storagePath = `${profile.company_id}/${currentPath ? currentPath + "/" : ""}${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file);

      if (uploadError) {
        toast({ title: "Erro no upload", description: file.name, variant: "destructive" });
        continue;
      }

      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(storagePath);

      await supabase.from("documents").insert({
        company_id: profile.company_id,
        uploaded_by: user.id,
        folder_path: currentPath,
        file_name: file.name,
        file_url: storagePath,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
      });
    }
    setUploading(false);
    toast({ title: "Upload concluído!" });
    fetchDocs();
    e.target.value = "";
  };

  const handleDelete = async (doc: Tables<"documents">) => {
    await supabase.storage.from("documents").remove([doc.file_url]);
    await supabase.from("documents").delete().eq("id", doc.id);
    toast({ title: "Documento excluído" });
    fetchDocs();
  };

  const handleDownload = async (doc: Tables<"documents">) => {
    const { data } = await supabase.storage.from("documents").download(doc.file_url);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCreateFolder = () => {
    if (!newFolder.trim()) return;
    const folderPath = currentPath ? `${currentPath}/${newFolder.trim()}` : newFolder.trim();
    // We create a virtual folder by navigating to it; actual docs will populate it
    setCurrentPath(folderPath);
    setNewFolder("");
    setShowFolderInput(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Documentos</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFolderInput(!showFolderInput)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              Nova Pasta
            </Button>
            <label>
              <Button variant="default" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Enviando..." : "Upload"}
                </span>
              </Button>
              <input type="file" className="hidden" multiple onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {showFolderInput && (
          <div className="flex gap-2">
            <Input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="Nome da pasta"
              maxLength={100}
            />
            <Button onClick={handleCreateFolder}>Criar</Button>
          </div>
        )}

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <button onClick={() => setCurrentPath("")} className="hover:text-primary">
            Raiz
          </button>
          {breadcrumbs.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              <span>/</span>
              <button
                onClick={() => setCurrentPath(breadcrumbs.slice(0, i + 1).join("/"))}
                className="hover:text-primary"
              >
                {part}
              </button>
            </span>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {currentPath && (
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={navigateUp}>
                <CardContent className="p-3 flex items-center gap-3">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">..</span>
                </CardContent>
              </Card>
            )}

            {subFolders.map((folder) => (
              <Card
                key={folder}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigateTo(folder)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{folder}</span>
                </CardContent>
              </Card>
            ))}

            {currentItems.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(doc.file_size)} · {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {(isAdmin || doc.uploaded_by === user?.id) && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {subFolders.length === 0 && currentItems.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Pasta vazia. Faça upload de um arquivo ou crie uma subpasta.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
