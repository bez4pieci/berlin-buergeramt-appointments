import { spawn } from 'child_process';
import 'dotenv/config';
import process from 'process';

export function isValidTwilioConfig() {
    return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE_NUMBER && process.env.TWILIO_TO_PHONE_NUMBER;
}

export function clearLine() {
    process.stdout.write('\r' + ' '.repeat(30) + '\r');
}

export function timeoutWithCountdown(callback, seconds) {
    process.stdout.write(`\rNext check in: ${seconds} seconds...`);

    const interval = setInterval(() => {
        seconds--;
        process.stdout.write(`\rNext check in: ${seconds} seconds...`);

        if (seconds <= 0) {
            clearInterval(interval);
            clearLine();
            callback();
        }
    }, 1000);
}

export function preventSleep() {
    switch (process.platform) {
        case 'darwin':
            console.log('Entering sleep prevention mode...');
            const caffeinate = spawn('caffeinate', ['-i', `-w ${process.pid}`]);

            process.on('exit', () => {
                console.log('\rExiting sleep prevention mode...');
                caffeinate.kill();
            });
            break;

        case 'linux':
            console.log('Entering sleep prevention mode...');
            const inhibit = spawn('systemd-inhibit', [
                '--what=sleep',
                '--who=berlin-buergeramt-appointments',
                '--why=Checking for available appointments in Berlin.de',
                '--mode=block',
                'sleep', 'infinity'
            ]);

            process.on('exit', () => {
                console.log('\rExiting sleep prevention mode...');
                inhibit.kill();
            });
            break;

        default:
            console.log('FYI: Sleep prevention is only supported on macOS and Linux. Make sure your computer does not sleep while this script is running.');
    }
}