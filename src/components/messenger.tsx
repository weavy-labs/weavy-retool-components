import React, { useEffect, useState } from 'react'
import { type FC } from 'react'
import { useWeavy, WyMessenger } from '@weavy/uikit-react'
import {
  useTokenFactory,
  useWeavyOptions,
  useWeavyUrl
} from '../properties/weavy'

import '../styles.css'
import { useThemeMode, useThemeStyles } from '../properties/theme'
import { useMessengerFeatures } from '../properties/features'
import { Retool } from '@tryretool/custom-component-support'

export const WeavyMessenger: FC = () => {
  const [bot] = Retool.useStateString({
    name: 'bot',
    description: 'Optional bot mode'
  })

  const features = useMessengerFeatures()
  const { modeClassName } = useThemeMode()
  const { themeStyles } = useThemeStyles()
  const { weavyUrl } = useWeavyUrl()
  const { tokenFactory } = useTokenFactory()
  const { weavyOptions } = useWeavyOptions()

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory,
    ...weavyOptions
  })

  return (
    <WyMessenger
      bot={bot}
      className={modeClassName}
      style={themeStyles}
      {...features}
    />
  )
}
