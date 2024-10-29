import React from 'react'
import { type FC } from 'react'
import { useWeavy, WyPosts } from '@weavy/uikit-react'
import {
  useTokenFactory,
  useWeavyOptions,
  useWeavyUrl
} from '../properties/weavy'

import '../styles.css'
import { useUid, useName } from '../properties/uid'
import { useThemeMode, useThemeStyles } from '../properties/theme'
import { usePostsFeatures } from '../properties/features'
import { useNavigationEventCallback, useNotificationProps } from '../properties/notifications'

export const WeavyPosts: FC = () => {
  const { name } = useName()
  const { uid } = useUid()
  const features = usePostsFeatures()
  const notifications = useNotificationProps()
  const { modeClassName } = useThemeMode()
  const { themeStyles } = useThemeStyles()
  const { weavyUrl } = useWeavyUrl()
  const { tokenFactory } = useTokenFactory()
  const { weavyOptions } = useWeavyOptions()
  const { navigationRefCallBack } = useNavigationEventCallback([uid])

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory,
    ...weavyOptions
  })

  return (
    <WyPosts
      uid={uid}
      name={name}
      className={modeClassName}
      style={themeStyles}
      ref={navigationRefCallBack}
      {...notifications}
      {...features}
    />
  )
}
