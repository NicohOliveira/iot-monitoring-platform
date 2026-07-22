const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');

const SENSOR_ID = 'GELADEIRA_SALA_01';
const TOPIC = `clinica/sensores/${SENSOR_ID}`;

let state = {
  temperature: 4.5,
  compressorOn: false,
  doorOpen: false
};

client.on('connect', () => {
  console.log(`[simulador] mqtt conectado. id: ${SENSOR_ID}`);
  
  setInterval(() => {
    simulatePhysics();
    
    const payload = JSON.stringify({
      id: SENSOR_ID,
      temp: state.temperature.toFixed(2),
      compressor: state.compressorOn,
      timestamp: new Date().toISOString()
    });

    client.publish(TOPIC, payload);
    console.log(`[enviado] ${payload}`);
  }, 5000);
});

function simulatePhysics() {
  if (state.doorOpen) {
    state.temperature += 0.5;
  } else {
    // controle basico de termostato e inercia
    if (state.temperature >= 7.5) {
      state.compressorOn = true;
    } else if (state.temperature <= 2.5) {
      state.compressorOn = false;
    }

    if (state.compressorOn) {
      state.temperature -= 0.3;
    } else {
      state.temperature += 0.1;
    }
  }
}
