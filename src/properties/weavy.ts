import { Retool } from '@tryretool/custom-component-support'

export const useAccessToken = () => {
  const [accessToken] = Retool.useStateString({
    name: 'accessToken',
    label: 'User access token *',
    initialValue: '{{ getWeavyToken.data?.access_token }}',
    description: 'The access token for the user'
  })
  const [getWeavyTokenCheck] = Retool.useStateString({
    name: 'getWeavyTokenCheck',
    label: 'getWeavyToken verification',
    initialValue: '{{ getWeavyToken.id }}',
    description: 'Field for verifying the getWeavyToken',
    inspector: 'hidden'
  })

  if (getWeavyTokenCheck !== "getWeavyToken") {
    throw new Error("No getWeavyToken workflow query defined. Create an imported workflow query called getWeavyToken and link it to the WeavyRetoolWorkflow.")
  }

  return { accessToken }
}

export const useWeavyUrl = () => {
  const [weavyUrl] = Retool.useStateString({
    name: 'weavyUrl',
    label: 'Weavy environment URL *',
    initialValue: '{{ retoolContext.configVars.WEAVY_URL || WEAVY_URL?.value }}',
    description: 'The url to the weavy environment'
  })

  if (weavyUrl === "") {
    throw new Error("No WEAVY_URL variable is defined in the Retool app. Make sure your app is configured with a Weavy environment url.")
  }

  return { weavyUrl }
}

export const useWeavyOptions = () => {
  const [weavyOptions] = Retool.useStateObject({
    name: 'weavyOptions',
    label: 'Weavy options',
    initialValue: {},
    description: 'Additional Weavy configuration properties'
  })
  return { weavyOptions }
}

export const useTokenFactory = () => {
  const { accessToken } = useAccessToken()
  const triggerRefresh = Retool.useEventCallback({ name: 'refresh-token' })

  const tokenFactory = accessToken ? async (refresh: boolean) => {
    if (refresh) {
      triggerRefresh()
    }
    return accessToken
  } : undefined

  return { tokenFactory }
}
