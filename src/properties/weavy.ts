import { Retool } from '@tryretool/custom-component-support'
import { useEffect, useState } from 'react'

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
    initialValue: '{{ retoolContext.configVars?.WEAVY_URL || window.WEAVY_URL }}',
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

  const tokenFactory = accessToken ? async (refresh: boolean) => {
    if (refresh) {
      triggerRefresh()
    }
    return accessToken
  } : undefined

  return { tokenFactory }
}
