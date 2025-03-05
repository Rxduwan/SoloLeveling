import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { StatsCard } from "@/components/stats-card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { PlayCircle, PauseCircle, RotateCcw } from "lucide-react";

export default function Home() {
  const [mode, setMode] = useState<"stats" | "pomodoro">("stats");
  const [stats, setStats] = useState({ healthXP: 0, financeXP: 0, deenXP: 0 });
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            toast({
              title: "Pomodoro Complete!",
              description: "Time to take a break.",
              duration: 5000,
            });
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">
            {mode === "stats" ? "Statistics" : "Pomodoro Timer"}
          </h1>
          <Button
            variant="outline"
            onClick={() => setMode(mode === "stats" ? "pomodoro" : "stats")}
          >
            Switch to {mode === "stats" ? "Pomodoro" : "Stats"}
          </Button>
        </div>

        {mode === "stats" ? (
          <div className="grid gap-6 md:grid-cols-3">
            <StatsCard 
              title="Health"
              xp={stats.healthXP}
              icon="❤️"
              onAddXP={(amount) => setStats(s => ({ ...s, healthXP: s.healthXP + amount }))}
            />
            <StatsCard
              title="Finance"
              xp={stats.financeXP}
              icon="💰"
              onAddXP={(amount) => setStats(s => ({ ...s, financeXP: s.financeXP + amount }))}
            />
            <StatsCard
              title="Deen"
              xp={stats.deenXP}
              icon="🕌"
              onAddXP={(amount) => setStats(s => ({ ...s, deenXP: s.deenXP + amount }))}
            />
          </div>
        ) : (
          <Card className="p-6 flex flex-col items-center space-y-6">
            <ProgressCircle value={(timeLeft / (25 * 60)) * 100}>
              <span className="text-4xl font-mono">{formatTime(timeLeft)}</span>
            </ProgressCircle>
            
            <div className="flex gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? (
                  <PauseCircle className="h-6 w-6 mr-2" />
                ) : (
                  <PlayCircle className="h-6 w-6 mr-2" />
                )}
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setTimeLeft(25 * 60);
                  setIsRunning(false);
                }}
              >
                <RotateCcw className="h-6 w-6 mr-2" />
                Reset
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
