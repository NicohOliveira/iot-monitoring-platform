const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const { processPayload, getAllSensors, getSensorData } = require('./predictiveEngine');

const app = express();
app.use(cors());
app.use(express.json());

const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');
const TOPIC = 'clinica/sensores/#'; 

mqttClient.on('connect', () => {
  console.log('backend conectado ao mqtt');
  mqttClient.subscribe(TOPIC);
});

mqttClient.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    processPayload(payload);
    console.log(`[mqtt] id: ${payload.id} | temp: ${payload.temp}c | motor: ${payload.compressor}`);
  } catch (e) {
    console.error('erro parse mqtt', e);
  }
});

app.get('/api/sensors', (req, res) => {
  res.json(getAllSensors());
});

app.get('/api/sensors/:id', (req, res) => {
  const data = getSensorData(req.params.id);
  if (!data) return res.status(404).json({ error: 'sensor nao encontrado' });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`api-core rodando na porta ${PORT}`);
});
