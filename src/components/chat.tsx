import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyChat } from '@weavy/uikit-react'
import {
  useTokenFactory,
  useWeavyOptions,
  useWeavyUrl
} from '../properties/weavy'

import '../styles.css'
import { useEncodedUid } from '../properties/uid'
import { useThemeMode, useThemeStyles } from '../properties/theme'
import { useChatFeatures } from '../properties/features'
import { useNotificationProps } from '../properties/notifications'

export const WeavyChat: FC = () => {
  const { encodedUid } = useEncodedUid("chat")
  const features = useChatFeatures()
  const notifications = useNotificationProps()
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
    <WyChat
      uid={encodedUid}
      className={modeClassName}
      style={themeStyles}
      {...notifications}
      {...features}
    />
  )
}
