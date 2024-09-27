import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyComments } from '@weavy/uikit-react'
import { useTokenFactory, useWeavyUrl } from '../properties/weavy'

import '../styles.css'
import { useEncodedUid } from '../properties/uid'
import { useThemeStyles } from '../properties/theme'
import { useCommentsFeatures } from '../properties/features'
import { useNotificationProps } from '../properties/notifications'

export const WeavyComments: FC = () => {
  const { encodedUid } = useEncodedUid();
  const features = useCommentsFeatures();
  const notifications = useNotificationProps()
  const { themeStyles } = useThemeStyles()
  const { tokenFactory } = useTokenFactory()
  const { weavyUrl } = useWeavyUrl()

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory
  })

  return <WyComments uid={encodedUid} style={themeStyles} {...notifications} {...features} />
}
