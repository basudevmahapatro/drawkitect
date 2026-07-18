"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

function ControlledProgress({
  progress = 0,
  title = "Uploading...",
  trailingLabel,
  showAction = true,
  actionLabel = "Reset",
  actionDisabled = false,
  onAction,
  actionIcon: ActionIcon = RefreshCw,
  className = "",
}) {
  return (
    <div className={`w-full max-w-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{title}</span>
        <span>{trailingLabel ?? `${Math.round(progress)}%`}</span>
      </div>
      <Progress value={progress} />
      {showAction && (
        <Button
          size="sm"
          variant="outline"
          disabled={actionDisabled}
          onClick={onAction}
          className="w-full gap-2 cursor-pointer">
          <ActionIcon className="size-3.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default function FileUploadProgress(props) {
  if (typeof props.progress === "number") {
    return <ControlledProgress {...props} />;
  }

  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    setProgress(0);
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(id); return 100; }
        return Math.min(prev + Math.random() * 8 + 1, 100);
      });
    }, 180);
    return () => clearInterval(id);
  }, [run]);

  const done = progress >= 100;

  return (
    <div className="w-full max-w-sm space-y-3">
      <div
        className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{done ? "Complete" : "Uploading..."}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
      <Button
        size="sm"
        variant="outline"
        disabled={!done}
        onClick={() => setRun((r) => r + 1)}
        className="w-full gap-2 cursor-pointer">
        <RefreshCw className="size-3.5" />
        Reset
      </Button>
    </div>
  );
}
