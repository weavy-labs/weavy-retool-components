import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyChat } from '@weavy/uikit-react'
import { useAccessToken, useTokenFactory, useWeavyUrl } from '../properties/weavy'

import '../styles.css'
import { useEncodedUid } from '../properties/uid'
import { useThemeStyles } from '../properties/theme'

export const WeavyChat: FC = () => {
  const { encodedUid } = useEncodedUid();
  const { tokenFactory } = useTokenFactory()
  const { weavyUrl } = useWeavyUrl()
  const { themeStyles } = useThemeStyles()

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory
  })

  return <WyChat uid={encodedUid} style={themeStyles} />
}
