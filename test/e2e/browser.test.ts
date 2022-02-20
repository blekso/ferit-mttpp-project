/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, test, xtest, expect } from '@jest/globals'
import { setupTest, shot, getBrowser, createPage } from '../../config'
import { BradUser } from '../testdata/users'

const getPageTitle = (title: string) => {
  const postfixTitle = ' | Haus der Digitalisierung'
  return title + postfixTitle
}

describe('/ (Home Page)', () => {
  setupTest({ waitFor: 500 })

  test('Should render page', async () => {
    const page = await createPage('/')

    const title = await page.title()
    expect(title).toBe('Das virtuelle Haus der Digitalisierung')

    await shot('render_test/frontpage', page)
  })

  test('Should show cookie banner', async () => {
    const page = await createPage('/', { disableDefaultCookies: true })
    await page.setViewportSize({ width: 1366, height: 768 })

    const alt = await page.getAttribute('//*[@id="__layout"]/div/div[6]/div', 'tabindex')
    expect(alt).toBe('-1')
    await shot('cookiebanner_show_test/01_cookiebanner_showing', page)
  })

  test('Should close cookie banner', async () => {
    const page = await createPage('/', { disableDefaultCookies: true })
    await page.setViewportSize({ width: 1366, height: 768 })

    const content = await page.textContent('#__layout > div > div.nj-cookiebanner-wrapper > div > div.flex.justify-center.w-full.nj-modal-center.items-center.min-h-screen > div > div > div > div.nj-modal-footer.bg-gray-100.pl-6.pr-6.pb-4.pt-6 > div > button.relative.nj-button.nj-button--base.nj-button--primary > span > span')
    expect(content.trim()).toBe('Zustimmen & fortfahren')

    await page.waitForSelector('.nj-modal-footer > .grid > .relative:nth-child(2) > .nj-button-text > span')
    await page.click('.nj-modal-footer > .grid > .relative:nth-child(2) > .nj-button-text > span')

    await shot('cookiebanner_close_test/01_cookiebanner_closed', page)
  })
})
