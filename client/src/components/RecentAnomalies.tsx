import { useAnomalies } from "@/hooks/use-vitals";
import { format } from "date-fns";
import { AlertCircle, ArrowRight, User } from "lucide-react";

export function RecentAnomalies() {
  const { data: anomalies = [], isLoading } = useAnomalies();

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[calc(100vh-[350px])] min-h-[600px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-card/50">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Incident Log
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Latest detected anomalies</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold pulse-glow">
          Live
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : anomalies.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 opacity-50" />
            </div>
            <p className="text-sm font-medium">System normal</p>
            <p className="text-xs opacity-70">No anomalies detected</p>
          </div>
        ) : (
          anomalies.map((anomaly, idx) => {
            const isCritical = (anomaly.severityScore ?? 0) > 0.8;
            
            return (
              <div 
                key={anomaly.id || idx}
                className={`p-4 rounded-xl border transition-all duration-300 hover:bg-white/5 group cursor-pointer ${
                  isCritical 
                    ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/60' 
                    : 'bg-warning/5 border-warning/20 hover:border-warning/50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-background rounded-lg border border-white/5">
                      <User className="w-4 h-4 text-foreground/70" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground">{anomaly.patientId}</span>
                      <span className="text-xs text-muted-foreground block">
                        {format(new Date(anomaly.timestamp), "MMM dd, HH:mm:ss")}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-md text-xs font-bold ${
                    isCritical ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                  }`}>
                    {(anomaly.severityScore ?? 0).toFixed(2)} Score
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-white/5">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">HR</div>
                    <div className="text-sm font-medium text-foreground">{anomaly.heartRate.toFixed(0)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">SpO2</div>
                    <div className="text-sm font-medium text-foreground">{anomaly.spo2.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Temp</div>
                    <div className="text-sm font-medium text-foreground">{anomaly.temperature.toFixed(1)}°</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Custom scrollbar styles specific for this component */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
