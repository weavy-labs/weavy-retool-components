require('dotenv').config()

const {
  getAndVerifyCredentialsWithRetoolDB
} = require('retool-cli/lib/utils//credentials')
const { postRequest } = require('retool-cli/lib/utils/networking')
const { getWorkflowsAndFolders } = require('retool-cli/lib/utils/workflows')
const { getAppsAndFolders, deleteApp } = require('retool-cli/lib/utils/apps')
const chalk = require('chalk')
const ora = require('ora')
const inquirer = require('inquirer')

const weavyComponents = require('../weavy-components.json')
const demoApp = require('../demo/weavy-components-basic-layout.json')
const workflowData = require('../queries/WeavyRetoolWorkflow.json')

const uuidRegex = /"collectionUuid","(?<uuid>[0-9a-f\-]+)"/gm
const revUuidRegex = /"collectionRevisionUuid","(?<revUuid>[0-9a-f\-]+)"/gm
const workflowRegex = /"workflowId","(?<workflowId>[0-9a-f\-]+)"/gm
const envRegex = /{{ window\.WEAVY_URL[^\}]*}}/gm

async function createWeavyApp(appName, credentials) {
  const { workflows } = await getWorkflowsAndFolders(credentials)

  const weavyWorkflow = workflows.find(
    (workflow) => workflow.name === workflowData.name
  )
  console.log(workflowData.name, weavyWorkflow?.id)

  let appState = demoApp.page.data.appState

  // Relink Weavy component library uuid

  appState = appState.replace(
    uuidRegex,
    `"collectionUuid","${weavyComponents.customComponentLibraryId}"`
  )
  appState = appState.replace(
    revUuidRegex,
    `"collectionRevisionUuid","${weavyComponents.id}"`
  )

  if (weavyWorkflow) {
    // Relink workflow uuid
    appState = appState.replace(
      workflowRegex,
      `"workflowId","${weavyWorkflow.id}"`
    )
  }

  // Patch environment variable
  if (process.env.WEAVY_URL) {
    // Defaulted value
    appState = appState.replace(
      envRegex,
      `{{ window.WEAVY_URL || retoolContext.configVars?.WEAVY_URL || \\"${process.env.WEAVY_URL}\\" }}`
    )
  } else {
    appState = appState.replace(
      envRegex,
      `{{ window.WEAVY_URL || retoolContext.configVars?.WEAVY_URL }}`
    )
  }

  const appsAndFolders = await getAppsAndFolders(credentials)

  const existingApp = appsAndFolders.apps.find((app) => app.name === appName)

  if (existingApp) {
    const replace = await inquirer.prompt([
      {
        name: 'confirm',
        message: 'Do you want to replace the existing '.concat(appName, '?'),
        type: 'confirm',
        default: false
      }
    ])

    if (replace.confirm) {
      await deleteApp(appName, credentials, false)
      existingApp = null
    }
  }

  if (!existingApp) {
    const spinner = ora('Creating App').start()

    const createAppResult = await postRequest(
      `${credentials.origin}/api/pages/createPage`,
      {
        pageName: appName,
        isGlobalWidget: false,
        isMobileApp: false,
        multiScreenMobileApp: false,
        appState
      }
    )
    spinner.stop()

    const { page } = createAppResult.data
    if (!page?.uuid) {
      console.log('Error creating app.')
      console.log(createAppResult.data)
      process.exit(1)
    } else {
      console.log('Successfully created a Weavy demo app. 🎉')
      console.log(
        `${chalk.bold('View in browser:')} ${credentials.origin}/editor/${
          page.uuid
        }`
      )
      return page
    }
  }
}

getAndVerifyCredentialsWithRetoolDB().then((credentials) =>
  createWeavyApp('Weavy Components - Basic Layout', credentials)
)
