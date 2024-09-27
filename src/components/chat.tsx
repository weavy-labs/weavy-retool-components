import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyChat } from '@weavy/uikit-react'
import { useTokenFactory, useWeavyUrl } from '../properties/weavy'

import '../styles.css'
import { useEncodedUid } from '../properties/uid'
import { useThemeStyles } from '../properties/theme'
import { useChatFeatures } from '../properties/features'
import { useNotificationProps } from '../properties/notifications'

export const WeavyChat: FC = () => {
  const { encodedUid } = useEncodedUid();
  const features = useChatFeatures();
  const notifications = useNotificationProps()
  const { themeStyles } = useThemeStyles()
  const { tokenFactory } = useTokenFactory()
  const { weavyUrl } = useWeavyUrl()

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory
  })

  return <WyChat uid={encodedUid} style={themeStyles} {...notifications} {...features} />
}
