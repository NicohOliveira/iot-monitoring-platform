import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ThermometerSnowflake, Power, AlertTriangle } from 'lucide-react';
import axios from 'axios';

function App() {
  const [sensor, setSensor] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/sensors/GELADEIRA_SALA_01');
        setSensor(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchDados();
    const interval = setInterval(fetchDados, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!sensor || !sensor.history || sensor.history.length === 0) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="glass-panel"><Activity className="animate-pulse" size={48} color="var(--accent)" /></div>
      </div>
    );
  }

  const currentState = sensor.history[sensor.history.length - 1];
  const isDanger = parseFloat(currentState.temp) > 8;
  const hasAlerts = sensor.alerts.length > 0;

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1>PharmaGuard</h1>
          <p style={{ color: 'var(--text-muted)', margin: '5px 0' }}>Monitoramento Preditivo de Cadeia de Frio</p>
        </div>
        <div className={`status-badge ${isDanger || hasAlerts ? 'status-warning' : 'status-ok'}`}>
          <Activity size={18} />
          {isDanger || hasAlerts ? 'Atenção Necessária' : 'Sistema Estável'}
        </div>
      </header>

      <div className="grid">
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-label">Temperatura Atual</span>
            <ThermometerSnowflake color={isDanger ? 'var(--danger)' : 'var(--accent)'} />
          </div>
          <div className="metric-value" style={{ color: isDanger ? 'var(--danger)' : 'white' }}>
            {currentState.temp} °C
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Faixa ideal: 2°C a 8°C
          </div>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="metric-label">Status do Motor</span>
            <Power color={sensor.compressorState ? 'var(--success)' : 'var(--text-muted)'} />
          </div>
          <div className="metric-value">
            {sensor.compressorState ? 'Ligado' : 'Desligado'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ciclos totais (Vida Útil): {sensor.totalCycles}
          </div>
        </div>
      </div>

      <div className="glass-panel chart-container">
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 500 }}>Inércia Térmica (Últimas leituras)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={sensor.history}>
            <XAxis dataKey="timestamp" tick={false} stroke="var(--text-muted)" />
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{ background: 'var(--bg-dark)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
              labelStyle={{ display: 'none' }}
            />
            <Line type="monotone" dataKey="temp" stroke="var(--accent)" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {hasAlerts && (
        <div className="glass-panel" style={{ marginTop: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.5)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} /> Alertas de Manutenção Preditiva (Heurística)
          </h3>
          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
            {sensor.alerts.map((al, idx) => (
              <li key={idx} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'white' }}>{new Date(al.timestamp).toLocaleTimeString()}:</strong> {al.msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
