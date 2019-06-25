const schedule = require("node-schedule")
const puppeteer = require("puppeteer")

let rule = new schedule.RecurrenceRule()
rule.minute = new schedule.Range(0, 5, 1)

module.exports = () => {
    const job = schedule.scheduleJob("*/5 * * * *", function() {
        scrape()
    })
}

async function scrape() {
    console.log("Let's scrape !")

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // page.on("console", consoleObj => console.log(consoleObj.text()))

    await page.goto("https://candidature.inp-toulouse.fr/ecandidat2/")

    await page.waitForSelector("#gwt-uid-3")

    // Connexion
    await page.type("#gwt-uid-3", process.env.TEST_USERNAME)
    await page.type("#gwt-uid-5", process.env.TEST_PASSWORD)
    await page.click(".v-slot-color-panel-connect:last-child .v-button.v-widget")
    await page.waitForNavigation()
    await page.waitFor(5000)

    // Click candidatures
    await page.waitForFunction("document.querySelector('.valo-menuaccordeon').children[1].children[0].children[7]")
    // await page.evaluate(async () => {
        // let candidatures = await document.querySelector(".valo-menuaccordeon").children[1].children[0].children[7]
        // console.log(candidatures)
    // })

    await browser.close()

    console.log("Scrape over.")
}

// Debug
scrape()
