import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-14 pt-28 lg:pt-32">
      <div className="container space-y-3 text-center">
        <h2 className="text-3xl tracking-tight md:text-5xl lg:text-6xl font-bold">
          Ready to bring your ideas to life?
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-balance mt-4 mb-8">
          Jump into a collaborative workspace. Create unlimited canvases, invite your team, and securely save your diagrams.
        </p>
        <div>
          <Button size="lg" className="mt-4 bg-black text-white hover:bg-black/90 shadow-md" asChild>
            <Link to="/workspace">Start Drawing</Link>
          </Button>
        </div>
      </div>

      <div className="text-primary mt-10 w-full md:mt-14 lg:mt-20 flex justify-center pb-12">
        <h1 className="text-[12vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/40 select-none">
          Drawkitect
        </h1>
      </div>
    </footer>
  );
}