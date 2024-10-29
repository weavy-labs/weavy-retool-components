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
const authenticationWorkflowData = require('../workflows/WeavyAuthentication.json')
const pageNavigationWorkflowData = require('../workflows/WeavyPageNavigation.json')

const uuidRegex = /"collectionUuid","(?<uuid>[0-9a-f\-]+)"/gm
const revUuidRegex = /"collectionRevisionUuid","(?<revUuid>[0-9a-f\-]+)"/gm
const workflowRegex = /"workflowId","(?<workflowId>[0-9a-f\-]+)"/gm
const envRegex = /{{ window\.WEAVY_URL[^\}]*}}/gm

const replaceAuthenticationUuid = "c89f5d62-2e6f-4043-b8b5-ff0beed070f7"
const replacePageNavigationUuid = "f79ef59e-0d9d-41ba-b3b4-331482a1a42d"

async function createWeavyApp(appName, credentials) {
  const { workflows } = await getWorkflowsAndFolders(credentials)

  const weavyAuthenticationWorkflow = workflows.find(
    (workflow) => workflow.name === authenticationWorkflowData.name
  )
  console.log(authenticationWorkflowData.name, weavyAuthenticationWorkflow?.id)

  const weavyPageNavigationWorkflow = workflows.find(
    (workflow) => workflow.name === pageNavigationWorkflowData.name
  )
  console.log(pageNavigationWorkflowData.name, weavyPageNavigationWorkflow?.id)

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

  // Relink workflow uuid:s
  appState = appState.replace(workflowRegex, (match, workflowId) => {
    if (
      weavyAuthenticationWorkflow &&
      workflowId === replaceAuthenticationUuid
    ) {
      return `"workflowId","${weavyAuthenticationWorkflow.id}"`
    }

    if (
      weavyPageNavigationWorkflow &&
      workflowId === replacePageNavigationUuid
    ) {
      return `"workflowId","${weavyPageNavigationWorkflow.id}"`
    }

    // no match
    return `"workflowId","${workflowId}"`
  })


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

  let existingApp = appsAndFolders.apps.find((app) => app.name === appName)

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
