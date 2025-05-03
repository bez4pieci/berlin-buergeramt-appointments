# Berlin Bürgeramt Appointments

This application automatically checks for available appointments on Berlin.de and sends SMS notifications when appointments are found.

## How It Works

The application:
1. Checks the specified Berlin.de service URL for available appointments
2. If appointments are available, it:
   - Displays a message in the console and plays a sound
   - Sends an SMS notification (if configured) with the link to the service, so you can quickly book the apartment even if you're not at your computer.
3. If no appointments are available, it checks again after the specified intervalval

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- A Twilio account (optional, for SMS notifications)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd berlin-buergeramt-appointments
```

2. Install dependencies:
```bash
npm install
```

3. Make a copy of `.env.default`, call it `.env`, and fill in the configuration variables (see below).

## Configuration

### Required Environment Variables

- `CHECK_INTERVAL`: Time between checks in seconds (default: 120 seconds)
- `SERVICE_URL`: The URL of the Berlin.de appointment service you want to monitor. You'll find all Berlin.de services [here](https://service.berlin.de/dienstleistungen/). 

Some common URLs:

- Anmeldung: `https://service.berlin.de/dienstleistung/120335/`
- Einbürgerungstest: `https://service.berlin.de/dienstleistung/351180/`
- eID-Karte für EU/EWR-Bürger/innen: `https://service.berlin.de/dienstleistung/330112/`

### Optional Environment Variables

For receiving an SMS message when there are avaialble appointments, you'll need to configure the following variables. The first three you'll find in your Twilio dashboard.

- `TWILIO_ACCOUNT_SID`: Your Twilio account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio auth token
- `TWILIO_FROM_PHONE_NUMBER`: Your Twilio phone number
- `TWILIO_TO_PHONE_NUMBER`: Your phone number to receive the SMS notifications

## Usage

Test SMS functionality to see if you have configured everything correctly (you don't want to miss that SMS when appointments become available):
```bash
npm run testsms
```

Start the application:
```bash
npm start
```