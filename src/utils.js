import chalk from 'chalk';
import { spawn } from 'child_process';
import 'dotenv/config';
import process from 'process';

export function isValidTwilioConfig() {
    return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE_NUMBER && process.env.TWILIO_TO_PHONE_NUMBER;
}

export function clearLine() {
    process.stdout.write('\r' + ' '.repeat(90) + '\r');
}

/**
 * @param {{ (): Promise<void>; (): void; }} callback
 * @param {number} durationInSeconds
 */
export async function timeoutWithCountdown(callback, durationInSeconds) {
    const thenInSeconds = Math.floor(Date.now() / 1000) + durationInSeconds;
    /**
     * @type {(value?: any) => void}
     */
    let resolve;
    /**
     * @type {string | number | NodeJS.Timeout | undefined}
     */
    let interval;

    setTimeout(() => {
        clearInterval(interval);
        resolve();
    }, durationInSeconds * 1000);

    interval = setInterval(() => {
        process.stdout.write(`\r[${new Date().toLocaleString()}] Next check in: ${chalk.whiteBright(thenInSeconds - Math.floor(Date.now() / 1000))} seconds...`);
    }, 100);

    await new Promise(res => {
        resolve = res;
    });

    clearLine();
    callback();
}

export function preventSleep() {
    switch (process.platform) {
        case 'darwin':
            console.log(chalk.grey('Entering sleep prevention mode...'));
            const caffeinate = spawn('caffeinate', ['-i', `-w ${process.pid}`]);

            process.on('exit', () => {
                console.log(chalk.grey('\rExiting sleep prevention mode...'));
                caffeinate.kill();
            });
            break;

        case 'linux':
            console.log(chalk.grey('Entering sleep prevention mode...'));
            const inhibit = spawn('systemd-inhibit', [
                '--what=sleep',
                '--who=berlin-buergeramt-appointments',
                '--why=Checking for available appointments in Berlin.de',
                '--mode=block',
                'sleep', 'infinity'
            ]);

            process.on('exit', () => {
                console.log(chalk.grey('\rExiting sleep prevention mode...'));
                inhibit.kill();
            });
            break;

        default:
            console.log(chalk.yellow('FYI: Sleep prevention is only supported on macOS and Linux. Make sure your computer does not sleep while this script is running.'));
    }
}