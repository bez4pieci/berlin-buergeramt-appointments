import { chromium } from 'playwright';

/**
 * @param {string} serviceURL
 * @returns {Promise<string[]>}
 * @throws {Error}
 */
export async function checkAppointments(serviceURL) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(serviceURL);
        await page.click('text=Berlinweite Terminbuchung');
        await page.waitForLoadState('networkidle');

        const appointmentsTitle = await page.textContent('h1.title');
        if (appointmentsTitle && !appointmentsTitle.trim().startsWith('Terminvereinbarung')) {
            throw new Error(`No appointments available: ${appointmentsTitle}`);
        }

        const dates = await page.locator('td.buchbar a').evaluateAll((elements) =>
            elements.map(element => element.getAttribute('title')?.substring(0, 10) ?? '')
                .filter(date => !!date)
        );

        if (dates.length === 0) {
            throw new Error('No dates available.');
        }

        return dates;

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
