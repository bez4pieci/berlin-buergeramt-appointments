import boxen from 'boxen';
import chalk from 'chalk';
import 'dotenv/config';
import { getServiceTitle } from './src/check_appointments.js';
import main from './src/main.js';
import { isTwilioConfigValid } from './src/sms.js';
import { preventSleep } from './src/utils.js';

const MIN_CHECK_INTERVAL = 120;
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL ?? String(MIN_CHECK_INTERVAL), 10); // 2 minutes in seconds
const SERVICE_URL = String(process.env.SERVICE_URL);

if (!SERVICE_URL) {
    console.error(chalk.red('Required environment variable SERVICE_URL is missing. Please check your .env file.'));
    process.exit(1);
}

if (CHECK_INTERVAL < MIN_CHECK_INTERVAL) {
    console.error(chalk.red(`CHECK_INTERVAL must be at least ${MIN_CHECK_INTERVAL} seconds or you risk being blocked by the service! Please check your .env file.`));
    process.exit(1);
}

const serviceTitle = await getServiceTitle(SERVICE_URL);
console.log(boxen(chalk.bold.cyanBright(serviceTitle), {
    title: 'Appointments for',
    titleAlignment: 'center',
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan'
}));

if (!isTwilioConfigValid()) {
    console.log(chalk.yellow('FYI: Twilio is not configured. You will not receive SMS notifications.'));
}

preventSleep();

main(SERVICE_URL, CHECK_INTERVAL);
