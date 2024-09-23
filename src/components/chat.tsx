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
    description: "The access token for the user"
  })

  const [weavyUrl, _setWeavyUrl] = Retool.useStateString({
    name: 'weavyUrl',
    initialValue: "",
    description: "The url to the weavy environment"
  })

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory: async () => accessToken
  })

  return (
    <WyChat uid={uid} />
  )
}
