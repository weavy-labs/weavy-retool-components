const getCCLClient = require('@tryretool/custom-component-support/getCCLClient')
const package = require('../package.json')
const fs = require('node:fs')
const chalk = require('chalk')
const ora = require('ora')
const _exec = require('child_process').exec
const util = require('util')

const exec = util.promisify(_exec)

getCCLClient.getCCLClient().then(async (client) => {
  let spinner = ora('Creating Custom Component Library').start()
  let library

  try {
    try {
      const response = await client.customComponentLibrariesPost({
        customComponentLibrariesPostRequest:
          package.retoolCustomComponentLibraryConfig
      })

      if (response.success) {
        library = response.data
      }
    } catch (e) {
      if (e.statusCode === 409) {
        spinner.stop()
        spinner = ora('Fetching Custom Component Library').start()
        const response = await client.customComponentLibrariesGet()

        if (response.success) {
          library = response.data.find(
            (lib) =>
              lib.name === package.retoolCustomComponentLibraryConfig.name
          )
        }
      } else {
        throw e
      }
    }
    spinner.stop()
  } catch (e) {
    spinner.stop()
    console.error('Error initializing components:', e.errorMessage)
  }

  if (library) {
    spinner = ora('Uploading components').start()
    await exec('npx retool-ccl deploy')
    spinner.stop()

    const revisionResponse =
      await client.customComponentLibrariesLibraryIdRevisionsGet({
        libraryId: library.id
      })

    if (revisionResponse.success) {
      const json = JSON.stringify(revisionResponse.data.pop())

      await fs.writeFile(
        './weavy-components.json',
        json,
        { encoding: 'utf8' },
        () => {
          console.log('Success 🥳')
        }
      )
    }
  }
})
