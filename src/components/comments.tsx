import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyComments } from '@weavy/uikit-react'
import {
  useTokenFactory,
  useWeavyOptions,
  useWeavyUrl
} from '../properties/weavy'

import '../styles.css'
import { useEncodedUid, useName } from '../properties/uid'
import { useThemeMode, useThemeStyles } from '../properties/theme'
import { useCommentsFeatures } from '../properties/features'
import { useNotificationProps } from '../properties/notifications'

export const WeavyComments: FC = () => {
  const { name } = useName()
  const { encodedUid } = useEncodedUid("comments")
  const features = useCommentsFeatures()
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
    <WyComments
      uid={encodedUid}
      name={name}
      className={modeClassName}
      style={themeStyles}
      {...notifications}
      {...features}
    />
  )
}
