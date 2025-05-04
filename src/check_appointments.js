import { chromium } from 'playwright';

/**
 * @param {string} serviceURL
 * @returns {Promise<boolean>}
 * @throws {Error}
 */
export async function checkAppointments(serviceURL) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(serviceURL);
        await page.click('text=Berlinweite Terminbuchung');
        await page.waitForLoadState('networkidle');

        const pageText = await page.textContent('body');
        if (!pageText) {
            throw new Error('Could not get page content!');
        }

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

/**
 * @param {string} serviceURL
 * @returns {Promise<string|null>}
 * @throws {Error}
 */
export async function getServiceTitle(serviceURL) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(serviceURL);
        return await page.textContent('h1.title');
    } catch (error) {
        throw error;

    } finally {
        await browser.close();
    }
}
