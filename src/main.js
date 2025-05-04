import chalk from "chalk";
import readlineSync from "readline-sync";
import terminalLink from "terminal-link";
import { checkAppointments } from "./check_appointments.js";
import { sendSMS } from "./sms.js";
import { clearLine, playHappyNotificationSound, timeoutWithCountdown } from "./utils.js";

/**
 * @param {string} serviceURL
 * @param {number} checkInterval
 */
export default async function main(serviceURL, checkInterval) {
    process.stdout.write(`\r[${new Date().toLocaleString()}] Checking for appointments...`);

    try {
        const dates = await checkAppointments(serviceURL);

        clearLine();
        console.log(`[${new Date().toLocaleString()}] ${chalk.greenBright(`Appointments found: ${dates.join(', ')}. Go to ${terminalLink(serviceURL, serviceURL)} and book your appointment!`)}`);

    } catch (error) {
        clearLine();
        console.log(`[${new Date().toLocaleString()}] ${chalk.red(error instanceof Error ? error.message : 'An unknown error occurred')}`);

        timeoutWithCountdown(() => main(serviceURL, checkInterval), checkInterval);
        return;
    }

    await Promise.allSettled([
        sendSMS(`Appointments found! ${serviceURL}`),
        playHappyNotificationSound()
    ]);

    if (readlineSync.keyInYNStrict('Do you want to continue looking for appointments?')) {
        main(serviceURL, checkInterval);
    } else {
        // Need explicit exit because the sleep prevention will not allow the script to exit automatically
        process.exit(0);
    }
}
