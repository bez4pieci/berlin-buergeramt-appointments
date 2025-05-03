import chalk from 'chalk';
import 'dotenv/config';
import Play from 'play-sound';
import readlineSync from 'readline-sync';
import { sendSMS } from 'src/sms.js';
import checkAppointments from './src/check_appointments.js';
import { clearLine, isValidTwilioConfig, preventSleep, timeoutWithCountdown } from './src/utils.js';

const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL ?? '120', 10); // 2 minutes in seconds
const SERVICE_URL = String(process.env.SERVICE_URL);

if (!SERVICE_URL) {
    console.error(chalk.red('Required environment variable SERVICE_URL is missing. Please check your .env file.'));
    process.exit(1);
}

if (!isValidTwilioConfig()) {
    console.log(chalk.yellow('FYI: Twilio is not configured. You will not receive SMS notifications.'));
}

preventSleep();

// @ts-ignore
const player = new Play();

async function loop() {
    process.stdout.write(`\rChecking for appointments...`);

    try {
        await checkAppointments(SERVICE_URL);

    } catch (error) {
        clearLine();
        console.log(`[${new Date().toLocaleString()}] ${chalk.red(error instanceof Error ? error.message : 'An unknown error occurred')}`);

        timeoutWithCountdown(loop, CHECK_INTERVAL);
        return;
    }

    clearLine();
    console.log(`[${new Date().toLocaleString()}] ${chalk.greenBright(`Appointments found! Go to ${SERVICE_URL} and book your appointment!`)}`);

    if (isValidTwilioConfig()) {
        sendSMS(`Appointments found! ${SERVICE_URL}`);
    }

    player.play('./media/heavenly-choir.aiff');

    if (readlineSync.keyInYNStrict('Do you want to continue looking for appointments?')) {
        loop();
    } else {
        // Need explicit exit to trigger removal of sleep prevention
        process.exit(0);
    }
}

loop();
