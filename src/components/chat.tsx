import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyChat } from '@weavy/uikit-react'
import { useAccessToken, useWeavyUrl } from '../properties/weavy'

import '../styles.css'
import { useUid } from '../properties/uid'
import { useThemeStyles } from '../properties/theme'

export const WeavyChat: FC = () => {
  const { uid } = useUid()
  const { accessToken } = useAccessToken()
  const { weavyUrl } = useWeavyUrl()
  const { themeStyles } = useThemeStyles()

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory: async () => accessToken
  })

  return <WyChat uid={uid} style={themeStyles} />
}
