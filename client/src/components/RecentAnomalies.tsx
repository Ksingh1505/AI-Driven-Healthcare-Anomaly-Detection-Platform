import { useAnomalies, useAlerts } from "@/hooks/use-vitals";
import { format } from "date-fns";
import { AlertCircle, Clock, User, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RecentAnomalies() {
  const { data: anomalies = [], isLoading: isLoadingAnomalies } = useAnomalies();
  const { data: alerts = [], isLoading: isLoadingAlerts } = useAlerts();

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[calc(100vh-350px)] min-h-[600px] overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-card/50">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Activity Feed
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Real-time health monitoring</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold pulse-glow">
          Live
        </div>
      </div>

      <Tabs defaultValue="anomalies" className="flex-1 flex flex-col">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-2 bg-white/5 p-1 rounded-xl">
            <TabsTrigger value="anomalies" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Anomalies
            </TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              System Alerts
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="anomalies" className="flex-1 overflow-hidden mt-0">
          <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoadingAnomalies ? (
              <div className="flex flex-col space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : anomalies.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p className="text-sm font-medium">No anomalies detected</p>
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
                            {format(new Date(anomaly.timestamp), "HH:mm:ss")}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-bold ${
                        isCritical ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                      }`}>
                        {(anomaly.severityScore ?? 0).toFixed(2)}
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
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 overflow-hidden mt-0">
          <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoadingAlerts ? (
              <div className="flex flex-col space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p className="text-sm font-medium">No alerts found</p>
              </div>
            ) : (
              alerts.map((alert: any, idx: number) => (
                <div
                  key={alert.id || idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className={`w-4 h-4 ${alert.severity === 'high' ? 'text-destructive' : 'text-primary'}`} />
                    <span className="text-sm font-bold">{alert.patientId} - {alert.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                  <span className="text-[10px] text-muted-foreground/60">{format(new Date(alert.timestamp), "HH:mm:ss")}</span>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
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
