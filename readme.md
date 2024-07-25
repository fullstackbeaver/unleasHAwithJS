# unleash Home Assistant with JS

This typeScript project is dedicated for javascript enthousiasts who would like to add super power to [Home Assistant](https://www.home-assistant.io/), a renowned open-source platform for home automation that providing a centralized hub for managing various smart devices.

## Installation
To set up this project, follow these steps:

Clone the Repository:
```Bash
git clone https://github.com/fullstackbeaver/unleasHAwithJS.git
```

Navigate to the Project Directory:
```Bash
cd unleasHAwithJS
```

Install Dependencies:
```Bash
bun install
```

Create settings.ts file in settings folder and add token.
If you use connection through web socket please add this lines:
```
export const token = "my long token";
export const homeAssistantAddress = "home_assistant_address:home_assistant:port";
```
If you use mqtt connection, please add this lines:
```
export const MQTTaddress = "mqtt://mqtt_address:mqtt_port";
export const MQTTclientId = "name_of_client_app";
export const MQTTpassword = "user_passworf";
export const MQTTuser = "user_name"
```

## Usage
DO NOT USE FOR THE MOMENT.
This project is in alpha statement and unfinished yet.

For start in dev mode use this command in your terminal:
```
bun dev
```

## Roadmap
- [ ] having a functional proof of concept which interacting with home assistant through web socket and mqtt, implementing DMX protocol trhough RS485 port.
- [x] migrate to [Bun](https://bun.sh/)
- [ ] save last state of the desired terminals (by a database or simply by using the MQTT functionality)
- [ ] add test
- [ ] add documentation
- [ ] convert it in order to be a plugin for home assistant
- [ ] change structure : move ports and handlers to modules

## Contribution
Contributions to this project are highly appreciated. Feel free to fork the repository, propose improvements, and submit pull requests.

## Quality
### sonarcloud evaluation
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=bugs)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fullstackbeaver_DMXha&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=fullstackbeaver_DMXha)

### unit tests
Unit tests are not implemented yet and will come in comming commits.

### documentation
No functional or technical documentation or wiki in fact actually only commented code based on JSdoc

Happy Home Automation!