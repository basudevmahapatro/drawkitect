"use client";;
import { useState } from "react";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const DEFAULT_ALERTS = [
  {
    id: 1,
    title: "Success Alert",
    description:
      "Alert notice communicate system status and provide feedback to users about their actions and options.",
    actionText: "Action",
    type: "success",
  },
  {
    id: 2,
    title: "Error Alert",
    description:
      "Alert notice communicate system status and provide feedback to users about their actions and options.",
    actionText: "Action",
    type: "error",
  },
];

const ALERT_STYLES = {
  success: {
    panelBg: "bg-white",
    borderColor: "border-black/10",
    textColor: "text-black",
    descriptionColor: "text-black/70",
    iconBg: "bg-black/5",
    iconColor: "text-black",
    btnBg: "bg-black hover:bg-black/90 text-white",
    closeHover: "hover:bg-black/5",
  },
  error: {
    panelBg: "bg-black",
    borderColor: "border-white/10",
    textColor: "text-white",
    descriptionColor: "text-white/70",
    iconBg: "bg-white/10",
    iconColor: "text-white",
    btnBg: "bg-white hover:bg-white/90 text-black",
    closeHover: "hover:bg-white/10",
  },
};

const AlertGradientDemo = ({
  alerts = DEFAULT_ALERTS
}) => {
  const [state, setState] = useState({
    expandedId: 1,
    closedIds: [],
  });

  const handleExpand = (id) =>
    setState((p) => ({ ...p, expandedId: p.expandedId === id ? null : id }));
  const handleClose = (id, e) => {
    e.stopPropagation();
    setState((p) => ({
      ...p,
      expandedId: p.expandedId === id ? null : p.expandedId,
      closedIds: [...p.closedIds, id],
    }));
  };

  const visibleAlerts = alerts.filter((a) => !state.closedIds.includes(a.id));
  if (visibleAlerts.length === 0) return null;

  const transition = { type: "spring", stiffness: 300, damping: 30 };
  const isFullscreen = visibleAlerts.some((alert) => alert.fullscreen);

  return (
    <div className={isFullscreen
      ? "fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm pointer-events-auto"
      : "fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2 pointer-events-auto sm:right-6 sm:top-6"}>
      {visibleAlerts.map((alert) => {
        const isExpanded = state.expandedId === alert.id;
        const styles = ALERT_STYLES[alert.type || "success"];
        const desc = alert.description;
        const isFullscreenAlert = Boolean(alert.fullscreen);

        return (
          <motion.div
            key={alert.id}
            layout
            transition={transition}
            onClick={() => handleExpand(alert.id)}
            className={`rounded-2xl border shadow-2xl flex gap-3 justify-between cursor-pointer select-none transition-colors duration-300 ${styles.panelBg} ${styles.borderColor} ${styles.textColor} ${isFullscreen ? "w-full max-w-2xl p-6 md:p-8" : "p-3"} ${isExpanded ? "items-start" : "items-center"}`}>
            <motion.div layout className={`p-2.5 md:p-3 shadow-sm rounded-full shrink-0 ${styles.iconBg}`}>
              <CircleAlertIcon size={isFullscreenAlert ? 20 : 16} className={styles.iconColor} />
            </motion.div>
            <motion.div
              layout
              transition={transition}
              className={`flex flex-1 gap-2 ${isExpanded ? "flex-col items-start" : "flex-row items-center justify-between overflow-hidden"}`}>
              <motion.div
                layout
                transition={transition}
                className={`flex gap-2 ${isExpanded ? "flex-col items-start gap-0.5" : "flex-row items-center"}`}>
                <motion.div layout="position" transition={transition}>
                  <AlertTitle className={`${isExpanded ? "" : "shrink-0 mb-0"} ${isFullscreenAlert ? "text-2xl md:text-3xl font-semibold" : ""}`}>
                    {alert.title}
                  </AlertTitle>
                </motion.div>
                <motion.div layout="position" transition={transition} className="min-w-0">
                  <AlertDescription className={`${styles.descriptionColor} ${isFullscreenAlert ? "text-base md:text-lg leading-7" : ""}`}>
                    {isExpanded
                      ? desc
                      : desc.length > 25
                        ? desc.slice(0, 25) + "..."
                        : desc}
                  </AlertDescription>
                </motion.div>
              </motion.div>

              {alert.actionText && (
                <motion.div layout transition={transition} onClick={(e) => e.stopPropagation()}>
                  <Button
                    className={`w-fit cursor-pointer shrink-0 ${styles.btnBg} ${isFullscreenAlert ? "h-11 px-6 text-base font-medium" : "text-xs"}`}
                    onClick={alert.onAction}>
                    {alert.actionText}
                  </Button>
                </motion.div>
              )}
            </motion.div>
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className={`cursor-pointer shrink-0 p-1 rounded-full ${styles.closeHover}`}
                  onClick={(e) => handleClose(alert.id, e)}>
                  <XIcon className={`${isFullscreenAlert ? "size-5" : "size-4"} text-white/90`} />
                  <span className="sr-only">Close</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AlertGradientDemo;