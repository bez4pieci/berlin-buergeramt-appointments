import process from 'process';
import Twilio from 'twilio';

/**
 * @returns {boolean}
 */
export function isTwilioConfigValid() {
    return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE_NUMBER && process.env.TWILIO_TO_PHONE_NUMBER);
}

/**
 * @param {string} message
 */
export async function sendSMS(message) {
    if (!isTwilioConfigValid()) {
        return;
    }

    // @ts-ignore
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

/**
 * @param {string} message
 */
export async function sendTestSMS(message) {
    if (!isTwilioConfigValid()) {
        console.error('Twilio is not configured. Please check your .env file.');
        return;
    }

    if (await sendSMS(message)) {
        console.log('SMS sent!');
    } else {
        console.error('Error sending SMS. Please check your Twilio configuration in .env file.');
    }
}
