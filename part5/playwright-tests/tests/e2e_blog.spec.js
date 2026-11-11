const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: "Dmitrii Presniakov",
                username: "predm",
                password: "password"
            }
        })

        await page.goto('/login')
    })

    test('login form is show', async ({ page }) => {
        const loginForm = page.locator('form')
        await expect(loginForm).toBeVisible()
    })

    describe('login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('link', { name: 'login' }).click()

            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('predm')
            await textboxes[1].fill('password')

            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('link', { name: 'login' }).click()

            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('kuku')
            await textboxes[1].fill('muku')

            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            const textboxes = await page.getByRole('textbox').all()
            await textboxes[0].fill('predm')
            await textboxes[1].fill('password')
            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
        })

        test('a new blog can  be created', async ({ page }) => {
            await page.getByRole('link', { name: 'new blog' }).click()

            await expect(page).toHaveURL('/create')

            await page.getByLabel('title').fill('Full Stack Open Course')
            await page.getByLabel('author').fill('University of Helsinki')
            await page.getByLabel('url').fill('https://fullstackopen.com/')
            await page.getByRole('button', { name: 'create' }).click()
            
            await expect(page).toHaveURL('/')
            await expect(page.getByText('a new blog Full Stack Open Course by University of Helsinki added')).toBeVisible()
            await page.getByRole('link', { name: 'Full Stack Open Course' }).click()
            await expect(page.getByRole('heading', { name: 'Full Stack Open Course' })).toBeVisible()
            await expect(page.locator('.blog').getByText('by University of Helsinki')).toBeVisible()
        })

        test('the blog can be liked', async ({ page }) => {
            await page.getByRole('link', { name: 'new blog' }).click()

            await expect(page).toHaveURL('/create')
            
            await page.getByLabel('title').fill('Full Stack Open Course')
            await page.getByLabel('author').fill('University of Helsinki')
            await page.getByLabel('url').fill('https://fullstackopen.com/')
            await page.getByRole('button', { name: 'create' }).click()
            
            await expect(page).toHaveURL('/')

            await page.getByRole('link', { name: 'Full Stack Open Course' }).click()
            const likes = page.getByRole('button', { name: 'like' }).locator('..')
            const textBefore = await likes.textContent()
            const initialLikes = parseInt(textBefore.replace(/\D/g, ''), 10) || 0

            await page.getByRole('button', { name: 'like' }).click()
            const expectedLikes = String(initialLikes + 1)

            await expect(likes).toHaveText(`Likes: ${expectedLikes}like`)
        })

        test('the blog can be delete', async ({ page }) => {
            await page.getByRole('link', { name: 'new blog' }).click()

            await expect(page).toHaveURL('/create')
            
            await page.getByLabel('title').fill('Blog for deleting')
            await page.getByLabel('author').fill('Jhon Doe')
            await page.getByLabel('url').fill('https://blogfordeleting.com/')
            await page.getByRole('button', { name: 'create' }).click()
            
            await expect(page).toHaveURL('/')
            
            await page.getByRole('link', { name: 'Blog for deleting' }).click()
            page.on('dialog', dialog => dialog.accept())
            const blogForDeleting = page.locator('.blog').filter({ hasText: 'Blog for deleting' })
            await blogForDeleting.getByRole('button', { name: 'Remove' }).click()

            await expect(page).toHaveURL('/')
            await expect(page.getByText('Blog for deleting by Jhon Doe was deleted successfully')).toBeVisible()
            await expect(page.getByRole('link', { name: 'Blog for deleting' })).toHaveCount(0)
        })

        test('only the user who added the blog sees the blog delete button', async ({ page, request }) => {
            await page.getByRole('link', { name: 'new blog' }).click()

            await expect(page).toHaveURL('/create')
            
            await page.getByLabel('title').fill('Blog for deleting')
            await page.getByLabel('author').fill('Jhon Doe')
            await page.getByLabel('url').fill('https://blogfordeleting.com/')
            await page.getByRole('button', { name: 'create' }).click()

            await page.getByRole('link', { name: 'Blog for deleting' }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).toBeVisible()

            await page.getByRole('button', { name: 'logout' }).click()
            await expect(page).toHaveURL('/')

            await request.post('http://localhost:3003/api/users', {
                data: {
                    name: 'Muku',
                    username: 'kuku',
                    password: 'password'
                }
            })
            await page.getByRole('link', { name: 'login' }).click()
            const textboxes = page.getByRole('textbox')
            await textboxes.nth(0).fill('kuku')
            await textboxes.nth(1).fill('password')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page).toHaveURL('/')

            await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()

            await page.getByRole('link', { name: 'Blog for deleting' }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0)
        })

        /*test('the blogs are arranged in the order according to the likes', async ({ page, request }) => {
            const loggedUser = await page.evaluate(() => {
                return JSON.parse(localStorage.getItem('loggedUser'))
            })

            const token = loggedUser.token

            const createBlog = async (title, author, url, likes) => {
                const response = await request.post('http://localhost:3003/api/blogs', {
                    data: {
                        title,
                        author,
                        url,
                        likes,
                    },

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                expect(response.status()).toBe(201)
            }

            await createBlog('First Blog', 'Dmitrii Presniakov', 'http://first.com', 8)
            await createBlog('Second Blog', 'Jhon Doe', 'http://second.com', 13)
            await createBlog('Third Blog', 'Muku', 'http://third.com', 3)

            await page.reload()

            await expect(page.locator('.blog').nth(0)).toContainText('Second Blog')
            await expect(page.locator('.blog').nth(1)).toContainText('First Blog')
            await expect(page.locator('.blog').nth(2)).toContainText('Third Blog')

        })*/
    })
})