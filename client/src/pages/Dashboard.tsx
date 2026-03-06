import { KPICards } from "@/components/KPICards";
import { PatientCharts } from "@/components/PatientCharts";
import { RecentAnomalies } from "@/components/RecentAnomalies";
import { Activity, Bell, Settings } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen pb-12">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 glass-panel border-b-0 border-white/10 rounded-b-3xl mb-8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground tracking-tight">AuraHealth</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Intelligence Platform</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full pulse-glow" />
          </button>
          <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-secondary border border-white/10 flex items-center justify-center text-sm font-bold text-foreground">
            Dr
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top KPIs */}
        <section>
          <KPICards />
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <PatientCharts />
          </div>
          <div className="xl:col-span-1">
            <RecentAnomalies />
          </div>
        </section>
      </main>
    </div>
  );
}
