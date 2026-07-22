const sensorsMemory = {};

function processPayload(payload) {
  const { id, temp, compressor, timestamp } = payload;
  const time = new Date(timestamp).getTime();
  
  if (!sensorsMemory[id]) {
    sensorsMemory[id] = {
      history: [],
      compressorState: compressor,
      lastCompressorToggle: time,
      totalOnTime: 0,
      totalCycles: 0,
      alerts: []
    };
  }

  const memory = sensorsMemory[id];
  memory.history.push(payload);
  
  if (memory.history.length > 50) memory.history.shift();

  if (memory.compressorState !== compressor) {
    const timeSpent = time - memory.lastCompressorToggle;
    
    if (memory.compressorState === true) {
      memory.totalOnTime += timeSpent;
      memory.totalCycles++;
      
      const averageOnTime = memory.totalOnTime / memory.totalCycles;
      
      // ia heuristica
      if (memory.totalCycles > 3 && timeSpent > averageOnTime * 1.5) {
        const alertMsg = `ineficiencia detectada. ciclo atual: ${(timeSpent/1000).toFixed(1)}s (media: ${(averageOnTime/1000).toFixed(1)}s). risco de falha.`;
        memory.alerts.push({ type: 'PREDICTIVE_MAINTENANCE', msg: alertMsg, timestamp: new Date().toISOString() });
        console.warn(`[alerta preditivo - ${id}] ${alertMsg}`);
      }
    }
    
    memory.compressorState = compressor;
    memory.lastCompressorToggle = time;
  }
}

function getSensorData(id) {
  return sensorsMemory[id] || null;
}

function getAllSensors() {
  return sensorsMemory;
}

module.exports = { processPayload, getSensorData, getAllSensors };
