"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function CreateOrgPage() {
  const [orgName, setOrgName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. Create Organisation
      const { data: org, error: orgError } = await supabase
        .from('organisations')
        .insert({ name: orgName })
        .select()
        .single();

      if (orgError) throw orgError;

      // 2. Update User Profile with Org and Role
      const { error: userError } = await supabase
        .from('users')
        .update({ org_id: org.id, role: 'owner' })
        .eq('id', user.id);

      if (userError) throw userError;

      toast.success("Organisation created!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-1">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-display text-primary mb-2">Create Organisation</h1>
            <p className="text-secondary text-sm">Set up your workspace</p>
          </div>

          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organisation Name</label>
              <Input
                type="text"
                placeholder="Acme Corp"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Organisation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
