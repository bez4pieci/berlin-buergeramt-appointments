import 'dotenv/config';
import checkAppointments from './src/check_appointments.js';
import { clearLine, displayCountdown, sendSMS, isValidTwilioConfig } from './src/utils.js';

const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL) || 120; // 2 minutes in seconds
const SERVICE_URL = process.env.SERVICE_URL;

if (!SERVICE_URL) {
    console.error('Required environment variable SERVICE_URL is missing. Please check your .env file.');
    process.exit(1);
}

if (!isValidTwilioConfig()) {
    console.log('FYI: Twilio is not configured. You will not receive SMS notifications.');
}

async function loop() {
    process.stdout.write(`\rChecking for appointments...`);

    try {
        await checkAppointments(SERVICE_URL);

    } catch (error) {
        clearLine();
        console.log(`[${new Date().toLocaleString()}] \x1b[31m${error?.message || 'An unknown error occurred'}\x1b[0m`);

        displayCountdown(CHECK_INTERVAL);
        setTimeout(loop, CHECK_INTERVAL * 1000);
        return;
    }

    clearLine();
    console.log(`[${new Date().toLocaleString()}] \x1b[32mAppointments found!\x1b[0m`);

    if(isValidTwilioConfig()) {
        sendSMS(`Appointments found! ${SERVICE_URL}`);
    }
}

loop();
