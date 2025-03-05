import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface StatsCardProps {
  title: string;
  xp: number;
  icon: string;
  onAddXP: (amount: number) => void;
}

export function StatsCard({ title, xp, icon, onAddXP }: StatsCardProps) {
  const [xpInput, setXpInput] = useState("");
  
  const level = Math.floor(xp / 100);
  const progress = (xp % 100);
  
  const getRank = () => {
    if (level >= 101) return "S-Rank (Mastery)";
    if (level >= 76) return "A-Rank (Elite)";
    if (level >= 51) return "B-Rank (Skilled)";
    if (level >= 26) return "C-Rank (Advanced)";
    if (level >= 11) return "D-Rank (Intermediate)";
    return "E-Rank (Beginner)";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-medium leading-none">{title}</h3>
        </div>
        <span className="text-sm text-muted-foreground">Level {level}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>{getRank()}</span>
              <span>{progress}/100 XP</span>
            </div>
            <Progress value={progress} />
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Add XP"
              value={xpInput}
              onChange={(e) => setXpInput(e.target.value)}
              className="w-24"
            />
            <Button
              size="sm"
              onClick={() => {
                const amount = parseInt(xpInput);
                if (!isNaN(amount)) {
                  onAddXP(amount);
                  setXpInput("");
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
