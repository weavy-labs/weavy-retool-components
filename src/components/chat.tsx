import React from 'react'
import { type FC } from 'react'

import { Retool } from '@tryretool/custom-component-support'
import { useWeavy, WyChat } from '@weavy/uikit-react'

import "../styles.css";

export const WeavyChat: FC = () => {
  const [uid, _setUid] = Retool.useStateString({
    name: 'uid',
    description: "The uid of the chat block."
  })

  const [accessToken, _setAccessToken] = Retool.useStateString({
    name: 'accessToken',
    label: 'User access token *',
    initialValue: '{{ getWeavyToken.data?.access_token }}',
    description: 'The access token for the user'
  })

  const [weavyUrl, _setWeavyUrl] = Retool.useStateString({
    name: 'weavyUrl',
    label: 'Weavy environment URL *',
    initialValue: '{{ getWeavyConfig.data?.url }}',
    description: 'The url to the weavy environment'
  })

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory: async () => accessToken
  })

  return (
    <WyChat uid={uid} />
  )
}
