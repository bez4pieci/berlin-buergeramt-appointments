import 'dotenv/config';
import Twilio from 'twilio';

export function isValidTwilioConfig() {
    return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE_NUMBER && process.env.TWILIO_TO_PHONE_NUMBER;
}

export function clearLine() {
    process.stdout.write('\r' + ' '.repeat(30) + '\r');
}

export function displayCountdown(seconds) {
    const interval = setInterval(() => {
        process.stdout.write(`\rNext check in: ${seconds} seconds...`);
        seconds--;

        if (seconds <= 0) {
            clearInterval(interval);
            clearLine();
        }
    }, 1000);
}

export async function sendSMS(message) {
    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_FROM_PHONE_NUMBER,
            to: process.env.TWILIO_TO_PHONE_NUMBER
        });
        return result;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function sendTestSMS(message) {
    if (!isValidTwilioConfig()) {
        console.error('Twilio is not configured. Please check your .env file.');
        return;
    }

    if(await sendSMS(message)) {
        console.log('SMS sent!');
    } else {
        console.error('Error sending SMS. Please check your Twilio configuration in .env file.');
    }
}