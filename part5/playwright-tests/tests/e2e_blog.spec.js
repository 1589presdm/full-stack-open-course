const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async({page, request}) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: "Dmitrii Presniakov",
                username: "predm",
                password: "password"
            }
        })

        await page.goto('/')
        

    })

    test('login form is show', async ({page}) => {
        const loginForm = page.locator('form')
        await expect(loginForm).toBeVisible()
    })

    describe('login', () => {
        test('succeeds with correct credentials', async ({page}) => {
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('predm')
            await textboxes[1].fill('password')

            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('Dmitrii Presniakov logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({page}) => {
            await page.getByLabel('username').fill('predm')
            await page.getByLabel('password').fill('wrong')

            await page.getByRole('button', {name: 'login'}).click()
            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({page}) => {
            await page.getByLabel('username').fill('predm')
            await page.getByLabel('password').fill('password')
            await page.getByRole('button', {name: 'login'}).click()
        })

        test('a new blog can  be created', async ({page}) => {
            await page.getByRole('button', { name: 'new blog'}).click()
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('Full Stack Open Course')
            await textboxes[1].fill('University of Helsinki')
            await textboxes[2].fill('https://fullstackopen.com/')
            await page.getByRole('button', {name: 'create'}).click()

            await expect(page.getByText('a new blog Full Stack Open Course by University of Helsinki added')).toBeVisible()
            await expect(page.locator('.blog').getByText('Full Stack Open Course')).toBeVisible()
            await expect(page.locator('.blog').getByText('University of Helsinki')).toBeVisible()
        })
    })
})