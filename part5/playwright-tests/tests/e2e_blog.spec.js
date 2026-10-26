const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async({page}) => {
        await page.goto('/')
    })

    test('login form is show', async ({page}) => {
        const loginForm = page.locator('form')
        await expect(loginForm).toBeVisible()
    })
})