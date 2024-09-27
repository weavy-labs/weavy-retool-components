import { Retool } from '@tryretool/custom-component-support'
import { useMemo } from 'react'

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
    initialValue: '{{ getWeavyConfig.data?.url }}',
    description: 'The url to the weavy environment'
  })
  return { weavyUrl }
}

export const useTokenFactory = () => {
  const { accessToken } = useAccessToken()
  const triggerRefresh = Retool.useEventCallback({ name: 'refresh-token' })

  const tokenFactory: WeavyTokenFactory = useMemo(
    () => async (refresh: boolean) => {
      if (refresh && accessToken) {
        triggerRefresh()
      }
      return accessToken
    },
    [accessToken]
  )

  return { tokenFactory }
}
