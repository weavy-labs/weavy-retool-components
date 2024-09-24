import { Retool } from '@tryretool/custom-component-support'

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
