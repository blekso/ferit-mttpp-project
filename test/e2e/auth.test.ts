
import { createPage, setupTest, shot } from '../../config/'
import { BradUser, RandomBradUser } from '../testdata/users'

const getPageTitle = (title: string) => {
  const postfixTitle = ' | Haus der Digitalisierung'
  return title + postfixTitle
}

describe('Auth Testing', () => {
  setupTest({ waitFor: 500 })

  test('On not valid userdata erromessage "Diese Email existiert nicht" pops up', async () => {
    const page = await createPage('/auth/login')
    // input logindata
    await page.waitForSelector('input#email')
    await page.type('input#email', RandomBradUser.email)
    await page.type('input#password', RandomBradUser.password)

    await page.waitForSelector('#signinForm button[type="submit"]')
    await page.click('#signinForm button[type="submit"]')

    const errorMessageContent = await page.textContent('//*[@id="__layout"]/div/div[1]/div[1]/div/div[1]/div/div/div[2]/span/span')

    expect(errorMessageContent).toContain('Diese E-Mail existiert nicht')

    await shot('invalid_login_data_test/01_login_failed', page)
  })

  test('User should be able to login with valid userdata', async () => {
    const page = await createPage('/auth/login')
    // input logindata
    await page.waitForSelector('input#email')
    await page.type('input#email', BradUser.email)
    await page.type('input#password', BradUser.password)

    await page.waitForSelector('#signinForm button[type="submit"]')
    await page.click('#signinForm button[type="submit"]')

    // lets wait for 6 seconds to be logged in.
    await new Promise(resolve => setTimeout(resolve, 6000))

    // close cookie banner
    await page.waitForSelector('.nj-modal-footer > .grid > .relative:nth-child(2) > .nj-button-text > span')
    await page.click('.nj-modal-footer > .grid > .relative:nth-child(2) > .nj-button-text > span')

    await shot('valid_data_login_test/01_login', page)

    const errorMessageContent = await page.textContent('//*[@id="3107"]/div[2]/h1[1]')

    expect(errorMessageContent.trim()).toBe('Brad Gibsom')

    await shot('valid_data_login_test/02_login_complete', page)
  })

  test('User should be able to signup on the website', async () => {
    const page = await createPage('/auth/signup')

    let title = await page.title()
    expect(title).toBe(getPageTitle('Registrierung'))

    await shot('register_test/01_register', page)

    // wait for register button to load and click on it
    await page.waitForSelector('//*[@id="__layout"]/div/div[1]/div[1]/div/div[2]/form/div[3]/div[1]/button')
    await page.click('//*[@id="__layout"]/div/div[1]/div[1]/div/div[2]/form/div[3]/div[1]/button')

    await new Promise(resolve => setTimeout(resolve, 6000))

    await shot('register_test/02_register', page)

    // wait for the next step where we enter info
    await page.waitForSelector('//*[@id="firstname"]')
    await page.type('//*[@id="firstname"]', RandomBradUser.firstname)
    await page.type('//*[@id="lastname"]', RandomBradUser.lastname)
    await page.type('//*[@id="email"]', RandomBradUser.email)
    await page.type('//*[@id="password"]', RandomBradUser.password)
    await page.type('//*[@id="confirmation"]', RandomBradUser.password)

    console.log(RandomBradUser)

    await page.click('input#news')
    expect(await page.isChecked('input#news')).toBeTruthy()
    await page.click('input#dsgvo')
    expect(await page.isChecked('input#dsgvo')).toBeTruthy()

    await shot('register_test/03_register', page)

    await page.click('//*[@id="__layout"]/div/div[1]/div[1]/div/div[2]/form/div[3]/div[1]/button')

    await new Promise(resolve => setTimeout(resolve, 6000))

    // close cookiebanner
    await page.waitForSelector('.nj-modal-footer > .grid > .relative:nth-child(2) > .nj-button-text > span')
    await page.click('.nj-modal-footer > .grid > .relative:nth-child(2) > .nj-button-text > span')

    title = await page.title()
    expect(title).toBe(RandomBradUser.firstname + ' ' + RandomBradUser.lastname)

    await shot('register_test/04_register_complete', page)
  })
})
