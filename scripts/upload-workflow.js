const {
  getAndVerifyCredentialsWithRetoolDB
} = require('retool-cli/lib/utils//credentials')
const { postRequest } = require('retool-cli/lib/utils/networking')
const { getWorkflowsAndFolders } = require('retool-cli/lib/utils/workflows')
const chalk = require('chalk')

const ora = require('ora')

const workflowData = require('../queries/WeavyRetoolWorkflow.json')

async function createWorkflow(newWorkflowName, credentials) {
  const { workflows } = await getWorkflowsAndFolders(credentials)

  let weavyWorkflow = workflows.find(
    (workflow) => workflow.name === workflowData.name
  )

  if (weavyWorkflow) {
    console.log('Successfully found a workflow. 🎉')
  } else {
    let spinner = ora('Creating workflow').start()

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
