import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Objective } from "@shared/schema";
import { Plus, CheckCircle2 } from "lucide-react";

export function ObjectivesSection() {
  const [newObjective, setNewObjective] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: objectives = [] } = useQuery<Objective[]>({
    queryKey: ["/api/objectives"],
  });

  const createObjective = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", "/api/objectives", { text });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/objectives"] });
      setNewObjective("");
      toast({
        title: "Objective added",
        description: "Your new daily objective has been added.",
      });
    },
  });

  const toggleObjective = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/objectives/${id}/toggle`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/objectives"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newObjective.trim()) {
      createObjective.mutate(newObjective.trim());
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-xl font-semibold">Daily Objectives</h2>
        <span className="text-sm text-muted-foreground">
          Resets at 12 AM UK Time
        </span>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Add a new objective..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="space-y-2">
          {objectives.map((objective) => (
            <div
              key={objective.id}
              className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
            >
              <Checkbox
                checked={objective.completed}
                onCheckedChange={() => toggleObjective.mutate(objective.id)}
                className="h-5 w-5"
              />
              <span
                className={
                  objective.completed ? "line-through text-muted-foreground" : ""
                }
              >
                {objective.text}
              </span>
              {objective.completed && (
                <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
              )}
            </div>
          ))}
          {objectives.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No objectives for today. Add some goals!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
