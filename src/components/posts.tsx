import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyPosts } from '@weavy/uikit-react'
import {
  useTokenFactory,
  useWeavyOptions,
  useWeavyUrl
} from '../properties/weavy'

import '../styles.css'
import { useEncodedUid, useName } from '../properties/uid'
import { useThemeMode, useThemeStyles } from '../properties/theme'
import { usePostsFeatures } from '../properties/features'
import { useNotificationProps } from '../properties/notifications'

export const WeavyPosts: FC = () => {
  const { name } = useName()
  const { encodedUid } = useEncodedUid("posts")
  const features = usePostsFeatures()
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
    <WyPosts
      uid={encodedUid}
      name={name}
      className={modeClassName}
      style={themeStyles}
      {...notifications}
      {...features}
    />
  )
}
