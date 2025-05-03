import chalk from 'chalk';
import 'dotenv/config';
import PlaySound from 'play-sound';
import checkAppointments from './src/check_appointments.js';
import { sendSMS } from './src/sms.js';
import { clearLine, isValidTwilioConfig, preventSleep, timeoutWithCountdown } from './src/utils.js';


const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL) || 120; // 2 minutes in seconds
const SERVICE_URL = process.env.SERVICE_URL;

if (!SERVICE_URL) {
    console.error(chalk.red('Required environment variable SERVICE_URL is missing. Please check your .env file.'));
    process.exit(1);
}

if (!isValidTwilioConfig()) {
    console.log(chalk.yellow('FYI: Twilio is not configured. You will not receive SMS notifications.'));
}

preventSleep();

const player = new PlaySound();

async function loop() {
    process.stdout.write(`\rChecking for appointments...`);

    try {
        await checkAppointments(SERVICE_URL);

    } catch (error) {
        clearLine();
        console.log(`[${new Date().toLocaleString()}] ${chalk.red(error?.message || 'An unknown error occurred')}`);

        timeoutWithCountdown(loop, CHECK_INTERVAL);
        return;
    }

    clearLine();
    console.log(`[${new Date().toLocaleString()}] ${chalk.greenBright(`Appointments found! Go to ${SERVICE_URL} and book your appointment!`)}`);

    if (isValidTwilioConfig()) {
        sendSMS(`Appointments found! ${SERVICE_URL}`);
    }

    await new Promise(resolve => {
        player.play('./media/heavenly-choir.aiff', () => {
            resolve();
        });
    });
}

loop();
