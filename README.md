# IoT Telemetry & Predictive Maintenance Platform

A scalable, agnostic IoT telemetry platform built to monitor critical environmental parameters (e.g., cold chain logistics, agriculture) and perform predictive maintenance on hardware equipment.

## Architecture

The project is structured as a monorepo containing:

- `apps/api-core`: Node.js/Express service. Acts as the main backend, processing incoming MQTT payloads, persisting data, and running anomaly detection algorithms.
- `apps/web-dashboard`: React application for data visualization and real-time alerts.
- `packages/simulators`: Node.js scripts simulating MQTT edge devices for testing and development.

## Key Features

- **Agnostic Ingestion**: Supports any sensor payload format routed through the MQTT protocol.
- **Predictive Maintenance**: Instead of static threshold alerts, the system calculates thermal inertia and duty cycle deviations to predict equipment failure before critical excursions occur.
- **Real-time Processing**: End-to-end telemetry pipeline using MQTT brokers and WebSockets for real-time dashboard updates.

## Setup

Navigate to the respective application directory and install dependencies:

```bash
# Core API
cd apps/api-core
npm install

# Dashboard
cd apps/web-dashboard
npm install
```
