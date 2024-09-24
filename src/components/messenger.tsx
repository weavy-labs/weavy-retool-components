import React, { useEffect, useState } from 'react'
import { type FC } from 'react'
import { useWeavy, WyMessenger } from '@weavy/uikit-react'
import { useAccessToken, useWeavyUrl } from '../properties/weavy'

import '../styles.css'
import { useThemeStyles } from '../properties/theme'

export const WeavyMessenger: FC = () => {
  const { accessToken } = useAccessToken()
  const { weavyUrl } = useWeavyUrl()
  const { themeStyles } = useThemeStyles()

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory: async () => accessToken
  })

  return <WyMessenger style={themeStyles} />
}
