require('dotenv').config()

const {
  getAndVerifyCredentialsWithRetoolDB
} = require('retool-cli/lib/utils//credentials')
const { postRequest } = require('retool-cli/lib/utils/networking')
const { getWorkflowsAndFolders, deleteWorkflow } = require('retool-cli/lib/utils/workflows')
const chalk = require('chalk')
const inquirer = require('inquirer')
const ora = require('ora')

const workflowData = require('../queries/WeavyRetoolWorkflow.json')

const envUrlRegex = /(?<=^|\s|{|,)WEAVY_URL:[\s]*(?<url>[^,}]+)/gm
const envApiKeyRegex = /(?<=^|\s|{|,)WEAVY_APIKEY:[\s]*(?<apiKey>[^,}]+)/gm

async function createWorkflow(newWorkflowName, credentials) {
  const { workflows } = await getWorkflowsAndFolders(credentials)

  let weavyWorkflow = workflows.find(
    (workflow) => workflow.name === workflowData.name
  )

  if (weavyWorkflow) {
    const replace = await inquirer.prompt([
      {
        name: 'confirm',
        message: 'Do you want to replace the existing '.concat(workflowData.name, '?'),
        type: 'confirm',
        default: false
      }
    ])

    if (replace.confirm) {
      await deleteWorkflow(workflowData.name, credentials, false)
      weavyWorkflow = null
    }
  }

  if (weavyWorkflow) {
    console.log('Using the existing workflow. 🎉')
  } else {
    let spinner = ora('Creating workflow').start()

    // Patch configuration

    if (process.env.WEAVY_URL) {
      // Defaulted value
      workflowData.templateData = workflowData.templateData.replace(envUrlRegex, `WEAVY_URL: retoolContext.configVars.WEAVY_URL || \\"${process.env.WEAVY_URL}\\"`)
    } else {
      workflowData.templateData = workflowData.templateData.replace(envUrlRegex, `WEAVY_URL: retoolContext.configVars.WEAVY_URL`)
    }

    if (process.env.WEAVY_APIKEY) {
      // Defaulted value
      workflowData.templateData = workflowData.templateData.replace(envApiKeyRegex, `WEAVY_APIKEY: retoolContext.configVars.WEAVY_APIKEY || \\"${process.env.WEAVY_APIKEY}\\"`)
    } else {
      workflowData.templateData = workflowData.templateData.replace(envApiKeyRegex, `WEAVY_APIKEY: retoolContext.configVars.WEAVY_APIKEY`)
    }


    // Create workflow.
    const workflow = await postRequest(
      `${credentials.origin}/api/workflow/import`,
      {
        newWorkflowName,
        workflowData
      }
    )
    spinner.stop()

    if (workflow.data.workflow.id) {
      weavyWorkflow = workflow.data.workflow
    } else {
      console.log('Error creating workflow: ')
      console.log(workflow)
      return
    }
    console.log('Successfully created a workflow. 🎉')
  }

  console.log(
    `${chalk.bold('View in browser:')} ${credentials.origin}/workflows/${
      weavyWorkflow.id
    }`
  )
}

getAndVerifyCredentialsWithRetoolDB().then((credentials) =>
  createWorkflow(workflowData.name, credentials)
)
