# Unleash Home Assistant with JS

This TypeScript project is dedicated to JavaScript enthusiasts who want to add superpowers to [Home Assistant](https://www.home-assistant.io/), a renowned open-source platform for home automation that provides a centralized hub for managing various smart devices.

## Installation

**/!\ this project use bun, and is not tested with Deno or node.js**

To set up this project, follow these steps:

1. Clone the Repository:
   ```bash
   git clone https://github.com/fullstackbeaver/jsPowerForHA.git
   ```

2. Navigate to the Project Directory:
   ```bash
   cd jsPowerForHA
   ```

3. Install Dependencies:
   ```bash
   bun install
   ```

4. Create a `settings.ts` file in the `settings` folder and add your token.
   - If you're using a WebSocket connection, add the following lines:
   ```typescript
   export const token = "my long token";
   export const homeAssistantAddress = "home_assistant_address:home_assistant_port";
   ```
   - If you're using an MQTT connection, add the following lines:
   ```typescript
   export const MQTTaddress = "mqtt://mqtt_address:mqtt_port";
   export const MQTTclientId = "client_app_name";
   export const MQTTpassword = "user_password";
   export const MQTTuser = "user_name";
   ```
   - If you're using an ArtNet connection, add the following lines:
   ```typescript
   export const DMXtransitionDurationInMs = myDurationAsNumberInMs;
   export const DMXsteps = numberOfStepsForTransition;
   export const ArtNetHost = "ipOfArtNetControler";
   ```

## Usage

Use [this project](https://github.com/fullstackbeaver/ha-config-generator) to generate the entity file configuration.

As you can notice there is no main branch because it is not ready for production : tests are missings.

To start in development mode, run this command in your terminal:
```bash
bun watch
```

## What can it actually do?

It can:
- Interact with Home Assistant's WebSocket
- Interact with Home Assistant through MQTT
- Handle lights, switches, and covers
- Control devices connected to a DMX output through the ArtNet protocol

Lights are dimmed softly with transition.
Covers give position to home assistant when there are moving.

## Customize to Your Needs

This project is designed for my personal use, where lights and switches (and covers behind the switches) are connected to a DMX controller. However, it can be easily adapted to your needs.

The structure follows a hexagonal architecture: business rules are in the core (where all entities are defined), and all external connections are managed in the infrastructure layer. The `state` file in the adapters folder contains helpers to adjust data between this software and Home Assistant. You can easily add or modify connectors and entities.

## Roadmap

- [x] Functional proof of concept that interacts with Home Assistant through WebSocket (and potentially MQTT)
- [ ] Upgrade covers: currently based on duration, but aiming for a smarter solution
- [ ] Add error handling
- [ ] Add tests
- [ ] Add documentation
- [ ] Implement auto-dimming lights based on sensor luminosity levels
- [ ] Add a "mode" or "scenario" feature
- [ ] Convert the project into a Home Assistant plugin
- [ ] Refactor structure: move ports and handlers into modules

## Contribution

Contributions to this project are highly appreciated. Feel free to fork the repository, propose improvements, and submit pull requests.

## Quality

### SonarCloud Evaluation
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=bugs)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_jsPowerForHA&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_jsPowerForHA)

### Unit Tests
Unit tests are not implemented yet but will be included in upcoming commits.

### Documentation
There is currently no functional or technical documentation or wiki; only code comments using JSDoc are provided.

---

Happy Home Automation!