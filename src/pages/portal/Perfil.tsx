import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Perfil() {
  const { user, profile, updatePassword } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível salvar.", variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      toast({ title: "Erro", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    if (newPass !== confirmPass) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    setChangingPass(true);
    const { error } = await updatePassword(newPass);
    setChangingPass(false);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível alterar a senha.", variant: "destructive" });
    } else {
      toast({ title: "Senha alterada com sucesso!" });
      setNewPass("");
      setConfirmPass("");
    }
  };

  return (
    <>
      <div className="space-y-6 max-w-lg">
        <h1 className="font-display text-2xl font-bold text-foreground">Meu Perfil</h1>

        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input value={profile?.email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={200} />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>Nova senha</Label>
                <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength={6} />
              </div>
              <div className="space-y-2">
                <Label>Confirmar nova senha</Label>
                <Input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={changingPass}>
                {changingPass ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
