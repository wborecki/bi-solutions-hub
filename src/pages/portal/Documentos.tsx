import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  Search,
  Building2,
  FileImage,
  FileSpreadsheet,
  File,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import type { Tables } from "@/integrations/supabase/types";

const getFileIcon = (mime: string) => {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv"))
    return FileSpreadsheet;
  if (mime.includes("pdf")) return FileText;
  return File;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function Documentos() {
  const { user, profile, isAdmin } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Tables<"documents">[]>([]);
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; fileName: string; percent: number } | null>(null);
  const [newFolder, setNewFolder] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    const [docsRes, companiesRes] = await Promise.all([
      supabase.from("documents").select("*").order("folder_path").order("file_name"),
      isAdmin
        ? supabase.from("companies").select("*").order("name")
        : Promise.resolve({ data: [] }),
    ]);
    setDocuments(docsRes.data ?? []);
    setCompanies((companiesRes.data ?? []) as Tables<"companies">[]);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  // Company map for quick lookups
  const companyMap = useMemo(() => {
    const map = new Map<string, string>();
    companies.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [companies]);

  // The effective company for upload (admin picks, client uses own)
  const uploadCompanyId = isAdmin
    ? selectedCompanyId !== "all"
      ? selectedCompanyId
      : null
    : profile?.company_id ?? null;

  // Filtered documents
  const filteredDocs = useMemo(() => {
    let docs = documents;
    if (isAdmin && selectedCompanyId !== "all") {
      docs = docs.filter((d) => d.company_id === selectedCompanyId);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.file_name.toLowerCase().includes(lower) ||
          d.folder_path.toLowerCase().includes(lower)
      );
    }
    return docs;
  }, [documents, selectedCompanyId, searchTerm, isAdmin]);

  // Current path items & subfolders
  const currentItems = filteredDocs.filter((d) => d.folder_path === currentPath);
  const subFolders = useMemo(() => {
    return [
      ...new Set(
        filteredDocs
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
  }, [filteredDocs, currentPath]);

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
    if (!files || !user || !uploadCompanyId) {
      if (!uploadCompanyId && isAdmin) {
        toast({
          title: "Selecione uma empresa",
          description: "Escolha a empresa de destino antes de fazer upload.",
          variant: "destructive",
        });
      }
      return;
    }

    setUploading(true);
    const fileList = Array.from(files);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress({ current: i + 1, total: fileList.length, fileName: file.name, percent: 0 });

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${uploadCompanyId}/${currentPath ? currentPath + "/" : ""}${Date.now()}_${safeName}`;

      // Upload with progress tracking via XHR
      const uploadResult = await new Promise<{ error: string | null }>(async (resolve) => {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          resolve({ error: "Sessão expirada. Faça login novamente." });
          return;
        }

        const xhr = new XMLHttpRequest();
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
        const url = `${supabaseUrl}/storage/v1/object/documents/${encodedPath}`;

        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            const percent = Math.round((evt.loaded / evt.total) * 100);
            setUploadProgress((prev) => prev ? { ...prev, percent } : null);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ error: null });
          } else {
            let msg = `HTTP ${xhr.status}`;
            try { msg = JSON.parse(xhr.responseText)?.message || msg; } catch {}
            resolve({ error: msg });
          }
        });

        xhr.addEventListener("error", () => resolve({ error: "Erro de rede" }));
        xhr.addEventListener("abort", () => resolve({ error: "Upload cancelado" }));

        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("apikey", supabaseKey);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.send(file);
      });

      if (uploadResult.error) {
        console.error("Storage upload error:", uploadResult.error);
        toast({
          title: "Erro no upload",
          description: uploadResult.error || `Falha ao enviar ${file.name}`,
          variant: "destructive",
        });
        continue;
      }

      const { error: insertError } = await supabase.from("documents").insert({
        company_id: uploadCompanyId,
        uploaded_by: user.id,
        folder_path: currentPath,
        file_name: file.name,
        file_url: storagePath,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
      });

      if (insertError) {
        console.error("DB insert error:", insertError);
        toast({
          title: "Erro ao registrar documento",
          description: insertError.message,
          variant: "destructive",
        });
        continue;
      }

      successCount++;
    }

    setUploading(false);
    setUploadProgress(null);
    if (successCount > 0) {
      toast({ title: `${successCount} arquivo${successCount > 1 ? "s" : ""} enviado${successCount > 1 ? "s" : ""}!` });
    }
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
    setCurrentPath(folderPath);
    setNewFolder("");
    setShowFolderInput(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-bold text-foreground">Documentos</h1>
            <div className="flex flex-wrap gap-2">
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
          {uploadProgress && (
            <div className="flex items-center gap-3">
              <Progress value={uploadProgress.percent} className="h-1.5 flex-1" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {uploadProgress.fileName.length > 20
                  ? uploadProgress.fileName.slice(0, 20) + "…"
                  : uploadProgress.fileName}
                {uploadProgress.total > 1 && ` (${uploadProgress.current}/${uploadProgress.total})`}
                {" · "}{uploadProgress.percent}%
              </span>
            </div>
          )}
        </div>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {isAdmin && companies.length > 0 && (
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
        {!searchTerm && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <button onClick={() => setCurrentPath("")} className="hover:text-primary font-medium">
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
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searchTerm ? (
          /* Search results - flat table */
          filteredDocs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhum documento encontrado para "{searchTerm}".
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Arquivo</TableHead>
                      {isAdmin && <TableHead>Empresa</TableHead>}
                      <TableHead>Pasta</TableHead>
                      <TableHead className="text-right">Tamanho</TableHead>
                      <TableHead className="text-right">Data</TableHead>
                      <TableHead className="text-right w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((doc) => {
                      const Icon = getFileIcon(doc.mime_type);
                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="font-medium text-sm truncate max-w-[200px]">
                                {doc.file_name}
                              </span>
                            </div>
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="text-sm text-muted-foreground">
                              {companyMap.get(doc.company_id) || "-"}
                            </TableCell>
                          )}
                          <TableCell className="text-sm text-muted-foreground">
                            {doc.folder_path || "/"}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {formatSize(doc.file_size)}
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                                <Download className="h-4 w-4" />
                              </Button>
                              {(isAdmin || doc.uploaded_by === user?.id) && (
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        ) : (
          /* Folder view */
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

            {currentItems.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Arquivo</TableHead>
                        {isAdmin && <TableHead>Empresa</TableHead>}
                        <TableHead className="text-right">Tamanho</TableHead>
                        <TableHead className="text-right">Data</TableHead>
                        <TableHead className="text-right w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((doc) => {
                        const Icon = getFileIcon(doc.mime_type);
                        return (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="font-medium text-sm">{doc.file_name}</span>
                              </div>
                            </TableCell>
                            {isAdmin && (
                              <TableCell className="text-sm text-muted-foreground">
                                {companyMap.get(doc.company_id) || "-"}
                              </TableCell>
                            )}
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {formatSize(doc.file_size)}
                            </TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">
                              {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                {(isAdmin || doc.uploaded_by === user?.id) && (
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : subFolders.length === 0 ? (
              <Card>
                <CardContent className="py-12 flex flex-col items-center gap-4 text-center text-muted-foreground">
                  <p>Pasta vazia. Faça upload de um arquivo ou crie uma subpasta.</p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("empty-upload")?.click()}
                      disabled={!uploadCompanyId}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Upload de arquivo
                    </Button>
                    <input
                      id="empty-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowFolderInput(true)}
                    >
                      <FolderPlus className="h-4 w-4 mr-2" /> Criar subpasta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
}
