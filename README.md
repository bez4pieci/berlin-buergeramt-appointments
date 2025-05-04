# Berlin Bürgeramt Appointments

This command-line application automatically checks for available appointments on Berlin.de and sends SMS notifications when appointments are found.

## How It Works

The application:
1. Checks the specified Berlin.de service URL for available appointments
2. If appointments are available, it:
   - Displays a message in the console and plays a sound
   - Sends an SMS notification (if configured) with the link to the service, so you can quickly book the apartment even if you're not at your computer.
3. If no appointments are available, it checks again after the specified intervalval

### Notes

- MacOS and Linux computers will not enter sleep mode while the application is running

## Prerequisites

- [Node.js](https://nodejs.org/en) (v22 or higher)
- A [Twilio](https://www.twilio.com/) account (optional, for SMS notifications)
   - Registration is free, and the trial account with its 100 SMSs per month probably will suffice.

## Installation

1. Clone the repository on your computer:
```bash
git clone git@github.com:bez4pieci/berlin-buergeramt-appointments.git
cd berlin-buergeramt-appointments
```

2. Install dependencies:
```bash
npm install
```

3. Make a copy of `.env.example`, call it `.env`, and fill in the configuration variables (see below).
```bash
cp .env.example .env
```

## Configuration

### Required

- `SERVICE_URL`: The URL of the Berlin.de appointment service you want to monitor. You'll find all Berlin.de services [here](https://service.berlin.de/dienstleistungen/). 

Some common URLs:

- Anmeldung: `https://service.berlin.de/dienstleistung/120335/`
- Einbürgerungstest: `https://service.berlin.de/dienstleistung/351180/`
- eID-Karte für EU/EWR-Bürger/innen: `https://service.berlin.de/dienstleistung/330112/`

### Setting up SMS notifications

For receiving an SMS message when there are avaialble appointments, you'll need to configure the following variables. The first three you'll find in your Twilio dashboard.

- `TWILIO_ACCOUNT_SID`: Your Twilio account SID
- `TWILIO_AUTH_TOKEN`: Your Twilio auth token
- `TWILIO_FROM_PHONE_NUMBER`: Your Twilio phone number
- `TWILIO_TO_PHONE_NUMBER`: Your phone number to receive the SMS notifications

### Optional stuff

- `CHECK_INTERVAL`: Time between checks in seconds (default and minimum: 120 seconds)

## Room for improvements

- Refactor to use [terminal-kit](https://www.npmjs.com/package/terminal-kit) instead of `chalk`

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Author

Ernests Karlsons
