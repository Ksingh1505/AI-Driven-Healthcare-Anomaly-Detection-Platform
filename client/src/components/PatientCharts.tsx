import { useState, useEffect } from "react";
import { usePatients, usePatientHistory } from "@/hooks/use-vitals";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Activity, HeartPulse, Wind } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-xl">
        <p className="text-sm text-muted-foreground mb-2">
          {format(new Date(label), "HH:mm:ss")}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-foreground">{entry.name}:</span>
            <span style={{ color: entry.color }}>{entry.value.toFixed(1)}</span>
          </div>
        ))}
        {data.anomalyFlag && (
          <div className="mt-2 text-xs font-bold text-destructive flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span>Anomaly Detected (Score: {data.severityScore?.toFixed(2)})</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function PatientCharts() {
  const { data: patients = [], isLoading: isLoadingPatients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Auto-select first patient when loaded
  useEffect(() => {
    if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0]);
    }
  }, [patients, selectedPatient]);

  const { data: history = [], isLoading: isLoadingHistory } = usePatientHistory(selectedPatient);

  if (isLoadingPatients) {
    return (
      <div className="glass-panel rounded-2xl h-[600px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Vitals Monitor</h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time telemetry and anomaly detection</p>
        </div>
        <select
          className="bg-card border border-white/10 text-foreground text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer min-w-[200px]"
          value={selectedPatient || ""}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="" disabled>Select a patient</option>
          {patients.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {isLoadingHistory ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <Activity className="w-12 h-12 mb-4 opacity-50" />
          <p>No telemetry data available for this patient.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-8 min-h-[500px]">
          {/* Heart Rate Chart */}
          <div className="h-48 relative group">
            <div className="absolute top-0 left-0 flex items-center space-x-2 z-10">
              <div className="p-1.5 bg-destructive/10 rounded-lg">
                <HeartPulse className="w-4 h-4 text-destructive" />
              </div>
              <span className="font-semibold text-sm">Heart Rate (bpm)</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(time) => format(new Date(time), "HH:mm")}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="heartRate" 
                  name="Heart Rate"
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHr)" 
                  isAnimationActive={false}
                />
                {history.map((entry, index) => 
                  entry.anomalyFlag ? (
                    <ReferenceDot 
                      key={`anomaly-hr-${index}`} 
                      x={entry.timestamp as any} 
                      y={entry.heartRate} 
                      r={4} 
                      fill="hsl(var(--destructive))" 
                      stroke="hsl(var(--background))" 
                      strokeWidth={2} 
                    />
                  ) : null
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* SpO2 Chart */}
          <div className="h-48 relative group">
            <div className="absolute top-0 left-0 flex items-center space-x-2 z-10">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Wind className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-sm">SpO2 (%)</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(time) => format(new Date(time), "HH:mm")}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  domain={[80, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="spo2" 
                  name="SpO2"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSpo2)" 
                  isAnimationActive={false}
                />
                {history.map((entry, index) => 
                  entry.anomalyFlag ? (
                    <ReferenceDot 
                      key={`anomaly-spo2-${index}`} 
                      x={entry.timestamp as any} 
                      y={entry.spo2} 
                      r={4} 
                      fill="hsl(var(--destructive))" 
                      stroke="hsl(var(--background))" 
                      strokeWidth={2} 
                    />
                  ) : null
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
