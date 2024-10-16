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
    initialValue: '{{ WEAVY_URL.value || window.WEAVY_URL || retoolContext.configVars.WEAVY_URL }}',
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
