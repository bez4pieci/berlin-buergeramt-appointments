import chalk from "chalk";
import Play from "play-sound";
import readlineSync from "readline-sync";
import terminalLink from "terminal-link";
import { checkAppointments } from "./check_appointments.js";
import { sendSMS } from "./sms.js";
import { clearLine, isValidTwilioConfig, timeoutWithCountdown } from "./utils.js";

// @ts-ignore
const player = new Play();

/**
 * @param {string} serviceURL
 * @param {number} checkInterval
 */
export default async function main(serviceURL, checkInterval) {
    process.stdout.write(`\r[${new Date().toLocaleString()}] Checking for appointments...`);

    try {
        await checkAppointments(serviceURL);

    } catch (error) {
        clearLine();
        console.log(`[${new Date().toLocaleString()}] ${chalk.red(error instanceof Error ? error.message : 'An unknown error occurred')}`);

        timeoutWithCountdown(() => main(serviceURL, checkInterval), checkInterval);
        return;
    }

    clearLine();
    console.log(`[${new Date().toLocaleString()}] ${chalk.greenBright(`Appointments found! Go to ${terminalLink(serviceURL, serviceURL)} and book your appointment!`)}`);

    if (isValidTwilioConfig()) {
        sendSMS(`Appointments found! ${serviceURL}`);
    }

    player.play('./media/heavenly-choir.aiff');

    if (readlineSync.keyInYNStrict('Do you want to continue looking for appointments?')) {
        main(serviceURL, checkInterval);
    } else {
        // Need explicit exit to trigger removal of sleep prevention
        process.exit(0);
    }
}