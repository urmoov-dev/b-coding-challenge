import { expect, test } from '@playwright/test';

test('home page loads main desktop default table structure properly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.app-layout')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('.themeSelector')).toBeVisible();
    await expect(page.locator('.i18n-dropdown')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.pageWrapper')).toBeVisible();
    await expect(page.locator('.component-positioner')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('tbody')).toBeVisible();
    await expect(page.locator('thead')).toBeVisible();
});
 
test('home page loads table structure in its route', async ({ page }) => {
    await page.goto('/table');
    await expect(page.locator('.app-layout')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('.themeSelector')).toBeVisible();
    await expect(page.locator('.i18n-dropdown')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.pageWrapper')).toBeVisible();
    await expect(page.locator('.component-positioner')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('tbody')).toBeVisible();
    await expect(page.locator('thead')).toBeVisible();
});
test('home page loads list structure in its route', async ({ page }) => {
    await page.goto('/list');
    await expect(page.locator('.app-layout')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('.themeSelector')).toBeVisible();
    await expect(page.locator('.i18n-dropdown')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.pageWrapper')).toBeVisible();
    await expect(page.locator('.component-positioner')).toBeVisible();
    await expect(page.locator('.list-container')).toBeVisible();
    await expect(page.locator('.side-list')).toBeVisible();
    await expect(page.locator('.list-header')).toBeVisible();
    await expect(page.locator('.sorted-list')).toBeVisible();
    await new Promise(resolve => {return setTimeout(resolve, 300)})
    await expect(page.locator('.details')).toBeVisible();
    await expect(page.locator('.alias-container')).toBeVisible();
    await expect(page.locator('.bitcoin-wrapper')).toBeVisible();
    await expect(page.locator('.public-key-container')).toBeVisible();
});
 