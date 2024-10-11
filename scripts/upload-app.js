require('dotenv').config()

const {
  getAndVerifyCredentialsWithRetoolDB
} = require('retool-cli/lib/utils//credentials')
const { postRequest } = require('retool-cli/lib/utils/networking')
const { getWorkflowsAndFolders } = require('retool-cli/lib/utils/workflows')
const chalk = require('chalk')
const ora = require('ora')

const weavyComponents = require('../weavy-components.json')
const demoApp = require('../demo/weavy-components-basic-layout.json')
const workflowData = require('../queries/WeavyRetoolWorkflow.json')

const COMPONENT_LIB_UUID = 'd662d7bf-07d4-40de-83a5-2f4ad6d90f43'
const COMPONENT_LIB_REVISION_ID = '10dca0bd-827a-4bdb-9ea4-89f917bd5657'
const WORKFLOW_UUID = '3901f3b1-8dd4-40fd-b217-fa393c35c3bf'

async function createWeavyApp(appName, credentials) {
  const { workflows } = await getWorkflowsAndFolders(credentials)

  const weavyWorkflow = workflows.find(
    (workflow) => workflow.name === workflowData.name
  )
  console.log(workflowData.name, weavyWorkflow?.id)

  const spinner = ora('Creating App').start()
  let appState = demoApp.page.data.appState

  // Relink Weavy component library uuid
  appState = appState.replace(COMPONENT_LIB_UUID, weavyComponents.customComponentLibraryId)
  appState = appState.replace(COMPONENT_LIB_REVISION_ID, weavyComponents.id)

  if (weavyWorkflow) {
    // Relink workflow uuid
    appState = appState.replace(WORKFLOW_UUID, weavyWorkflow.id)
  }

  if (process.env.WEAVY_URL) {
      // Patch environment variable
      appState = appState.replace(
        '{{ retoolContext.configVars.WEAVY_URL }}',
        `{{ retoolContext.configVars?.WEAVY_URL || \\"${process.env.WEAVY_URL}\\" }}`
      )
  }

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

getAndVerifyCredentialsWithRetoolDB().then((credentials) =>
  createWeavyApp('Weavy Components - Basic Layout', credentials)
)
