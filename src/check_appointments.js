import { chromium } from 'playwright';

export default async function checkAppointments(serviceURL) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(serviceURL);
        await page.click('text=Berlinweite Terminbuchung');
        await page.waitForLoadState('networkidle');

        const pageText = await page.textContent('body');
        if (pageText.includes('Leider sind aktuell keine Termine für ihre Auswahl verfügbar')) {
            throw new Error('No appointments available.');
        } else {
            return true;
        }

    } catch (error) {
        throw error;

    } finally {
        await browser.close();
    }
}
