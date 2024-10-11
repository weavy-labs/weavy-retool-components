require('dotenv').config();

const {
  getAndVerifyCredentialsWithRetoolDB
} = require('retool-cli/lib/utils/credentials')
const { getRequest, postRequest } = require('retool-cli/lib/utils/networking')
const package = require('../package.json')
const fs = require('node:fs')
const chalk = require('chalk')
const ora = require('ora')

async function getEnvironments(credentials) {
  const spinner = ora('Getting Retool environments').start()
  let environments

  try {
    const getEnvironmentsResult = await getRequest(
      `${credentials.origin}/api/environments`
    )

    environments = getEnvironmentsResult.data?.environments

    spinner.stop()
  } catch (e) {
    spinner.stop()
    console.error('Error getting environments:', e.errorMessage)
    throw e
  }

  return environments
}

async function getConfigVariables(credentials) {
  const spinner = ora('Getting config variables').start()
  let configVars

  try {
    const getConfigVarsResult = await getRequest(
      `${credentials.origin}/api/configVars`
    )

    configVars = getConfigVarsResult.data

    spinner.stop()
  } catch (e) {
    spinner.stop()
    console.error('Error getting config variables:', e.errorMessage)
    throw e
  }

  return configVars
}

async function createConfigVariable(
  name,
  description,
  value,
  secret = false,
  environments,
  credentials
) {
  const spinner = ora('Creating config variables').start()
  let configVar

  let configVarPayload = {
    name: name,
    description: description,
    secret: secret,
    values: {}
  }

  environments.forEach((environment) => {
    configVarPayload.values[environment.id] = { value: value }
  })

  try {
    const getConfigVarsResult = await postRequest(
      `${credentials.origin}/api/configVars`,
      configVarPayload
    )

    configVar = getConfigVarsResult.data

    spinner.stop()
  } catch (e) {
    spinner.stop()
    console.error('Error configuring variable:', e.errorMessage)
    throw e
  }

  return configVar
}

getAndVerifyCredentialsWithRetoolDB().then(async (credentials) => {
  const environments = await getEnvironments(credentials)

  if (environments.length) {
    let configVars = await getConfigVariables(credentials)
  
    if (!configVars.find((configVar) => configVar.name === 'WEAVY_URL')) {
      if (process.env.WEAVY_URL) {
        
        try {
          await createConfigVariable(
            'WEAVY_URL',
            'URL to Weavy environment',
            process.env.WEAVY_URL,
            false,
            environments,
            credentials
          )
          console.log("Added WEAVY_URL configuration variable")
        } catch(e) {
          console.warn('Could not add WEAVY_URL configuration variable')
        }
      } else {
        console.warn('No WEAVY_URL configured in .env')
      }
    }
    if (!configVars.find((configVar) => configVar.name === 'WEAVY_APIKEY')) {
      if (process.env.WEAVY_APIKEY) {
        try {
          await createConfigVariable(
            'WEAVY_APIKEY',
            'API key for Weavy environment',
            process.env.WEAVY_APIKEY,
            true,
            environments,
            credentials
          )
          console.log("Added WEAVY_APIKEY configuration variable")
        } catch(e) {
          console.warn('Could not add WEAVY_APIKEY configuration variable')
        }
      } else {
        console.warn('No WEAVY_APIKEY configured in .env')
      }
    }
  }
})
