import { useRef, useEffect } from "react";
import { 
  ArrowRight, MousePointer2, Pen, Square, Circle, 
  Type, StickyNote, Download, Settings, Sparkles, 
  RefreshCw, Database, MessageSquare 
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";



const features = [
  {
    title: "Real-Time Sync",
    description: "Lightning-fast live collaboration via WebSockets.",
    icon: RefreshCw
  },
  {
    title: "State Persistence",
    description: "Never lose a stroke. Everything auto-saves to the cloud.",
    icon: Database
  },
  {
    title: "Spatial Comments",
    description: "Pin notes and conversations anywhere on the board.",
    icon: MessageSquare
  }
];

export const Hero = () => {
  return (
    <section className="relative z-0 py-28 lg:py-32 lg:pt-44 overflow-hidden">
      
      <div className="container relative z-10 flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        {/* Left side - Main content */}
        <div className="flex-1">

          <h1 className="text-foreground max-w-[800px] text-4xl tracking-tight md:text-5xl lg:text-6xl font-bold leading-tight">
            Drawkitect : The Real-Time Digital Whiteboard for Modern Teams.
          </h1>

          <p className="text-muted-foreground text-lg mt-5 md:text-xl lg:max-w-2xl leading-relaxed">
            Create, collaborate, and securely store hand-drawn style diagrams with pixel-perfect state persistence and live multiplayer.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button size="lg" className="gap-2 text-base h-12 px-8 bg-black text-white hover:bg-black/90 shadow-md" asChild>
              <Link to="/workspace">
                Start Drawing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base shadow-sm bg-background/50 backdrop-blur-sm hover:bg-black/5 dark:hover:bg-white/5" asChild>
              <a href="https://github.com/basudevmahapatro/drawkitect" target="_blank" rel="noopener noreferrer">
                View GitHub
              </a>
            </Button>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="relative flex flex-1 flex-col justify-center space-y-6 max-lg:pt-10 lg:pl-10">
          <DashedLine orientation="vertical" className="absolute top-0 left-0 max-lg:hidden" />
          <DashedLine orientation="horizontal" className="absolute top-0 lg:hidden" />
          {features.map(feature => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-4 lg:gap-5 group bg-card/70 backdrop-blur-md p-5 rounded-2xl border border-border/80 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
                <div className="bg-primary/15 p-3 rounded-xl h-fit group-hover:bg-primary/25 transition-colors">
                  <Icon className="text-primary size-6 shrink-0" />
                </div>
                <div>
                  <h2 className="font-text text-foreground font-semibold text-lg">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 mt-16 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-24 lg:container lg:mt-32">
        <div className="relative h-[600px] lg:h-[793px] w-full rounded-2xl border bg-card shadow-2xl overflow-hidden flex flex-col ring-1 ring-border/50">
          {/* Browser Header */}
          <div className="h-12 border-b bg-muted flex items-center px-4 gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20" />
            </div>
            <div className="mx-auto bg-background/80 border text-muted-foreground text-xs px-3 py-1.5 rounded-md flex items-center gap-2 w-64 justify-center shadow-sm backdrop-blur-sm">
              <Settings className="w-3 h-3" /> drawkitect.app/room/modern-teams
            </div>
            <div className="w-[52px]" /> {/* Spacer for centering */}
          </div>
          
          {/* Canvas Area */}
          <div className="flex-1 relative overflow-hidden bg-dot-pattern" style={{ backgroundImage: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            {/* Hardcoded Drawings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M150,150 C200,120 300,140 320,180 C340,220 280,280 200,290 C120,300 80,240 100,180 C120,120 180,160 150,150 Z" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-500" style={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
              <path d="M400,200 L550,220 L530,350 L380,330 Z" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500" style={{ fill: 'rgba(249, 115, 22, 0.1)' }} />
              <path d="M300,300 C320,350 380,380 430,320" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary" strokeDasharray="5,5" />
            </svg>

            {/* Live Cursors */}
            <motion.div 
              className="absolute top-[30%] left-[40%] flex flex-col items-center pointer-events-none z-10"
              animate={{ x: [0, 150, 80, -40, 0], y: [0, -60, 100, 40, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <MousePointer2 className="w-5 h-5 text-blue-500 fill-blue-500" />
              <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-1 shadow-sm">Alex</div>
            </motion.div>
            
            <motion.div 
              className="absolute top-[50%] left-[60%] flex flex-col items-center pointer-events-none z-10"
              animate={{ x: [0, -100, -30, 80, 0], y: [0, 80, -40, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <MousePointer2 className="w-5 h-5 text-orange-500 fill-orange-500" />
              <div className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm mt-1 shadow-sm">Sam</div>
            </motion.div>

            {/* Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-md border shadow-xl rounded-xl flex items-center p-2 gap-1.5 z-20">
              <div className="p-2 bg-muted rounded-lg cursor-pointer"><MousePointer2 className="w-4 h-4 text-foreground" /></div>
              <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"><Pen className="w-4 h-4 text-muted-foreground" /></div>
              <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"><Square className="w-4 h-4 text-muted-foreground" /></div>
              <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"><Circle className="w-4 h-4 text-muted-foreground" /></div>
              <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"><Type className="w-4 h-4 text-muted-foreground" /></div>
              <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"><StickyNote className="w-4 h-4 text-muted-foreground" /></div>
              <div className="w-px h-6 bg-border mx-1" />
              <div className="p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"><Download className="w-4 h-4 text-muted-foreground" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};