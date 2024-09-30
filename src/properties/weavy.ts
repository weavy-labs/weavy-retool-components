import { Retool } from '@tryretool/custom-component-support'

export type WeavyTokenFactory = (refresh: boolean) => Promise<string>

export const useAccessToken = () => {
  const [accessToken] = Retool.useStateString({
    name: 'accessToken',
    label: 'User access token *',
    initialValue: '{{ getWeavyToken.data?.access_token }}',
    description: 'The access token for the user'
  })
  return { accessToken }
}

export const useWeavyUrl = () => {
  const [weavyUrl] = Retool.useStateString({
    name: 'weavyUrl',
    label: 'Weavy environment URL *',
    initialValue: '{{ retoolContext.configVars.WEAVY_URL }}',
    description: 'The url to the weavy environment'
  })
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

  const tokenFactory: WeavyTokenFactory = async (refresh: boolean) => {
    if (refresh && accessToken) {
      triggerRefresh()
    }
    return accessToken
  }

  return { tokenFactory }
}
