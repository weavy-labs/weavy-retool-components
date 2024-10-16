// https://mindroutedev.retool.com/api/organization/admin/libraries

require('dotenv').config()

const {
  getAndVerifyCredentialsWithRetoolDB
} = require('retool-cli/lib/utils/credentials')
const {
  getRequest,
  deleteRequest
} = require('retool-cli/lib/utils/networking')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')
const axios = require('axios')

const jsRegex = /window\.WEAVY_URL\s*=\s*(?<url>[^\n;]*);?/gm

async function getOrgJS(credentials) {
  const spinner = ora('Getting preloaded organization JavaScripts').start()
  let js

  try {
    const getOrgResult = await getRequest(
      `${credentials.origin}/api/organization/admin`
    )

    js = getOrgResult.data?.org.preloadedJavaScript

    spinner.stop()
  } catch (e) {
    spinner.stop()
    console.error('Error getting organization:', e.errorMessage)
    throw e
  }

  return js
}

async function saveOrgJS(js, credentials) {
  const spinner = ora('Saving preloaded organization JavaScripts').start()

  try {
    const saveJsResult = await axios.patch(
      `${credentials.origin}/api/organization/admin/libraries`,
      { preloadedJavaScript: js }
    )

    js = saveJsResult.data?.organization.preloadedJavaScript

    spinner.stop()
  } catch (e) {
    spinner.stop()
    console.error('Error saving organization JS:', e.errorMessage)
    throw e
  }

  console.log('Successfully saved organization JavaScript 🤩')

  console.log(
    `${chalk.bold('View in browser:')} ${credentials.origin}/settings/advanced`
  )

  return js
}

getAndVerifyCredentialsWithRetoolDB().then(async (credentials) => {
  let js = await getOrgJS(credentials)

  let changedJS

  if (js.match(jsRegex)) {
    const replace = await inquirer.prompt([
      {
        name: 'confirm',
        message:
          'Do you want to replace the existing javascript variable window.WEAVY_URL?',
        type: 'confirm',
        default: false
      }
    ])
    if (replace.confirm) {
        changedJS = js.replace(
        jsRegex,
        process.env.WEAVY_URL
          ? `window.WEAVY_URL = "${process.env.WEAVY_URL}";`
          : ''
      )
    }
  } else {
    changedJS = `${js}${js ? '\n' : ''}window.WEAVY_URL = "${process.env.WEAVY_URL}";`
  }

  if (changedJS !== undefined) {
      await saveOrgJS(js, credentials)
  }
})
