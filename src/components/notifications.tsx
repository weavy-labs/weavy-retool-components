import React, { useEffect } from 'react'
import { type FC } from 'react'
import { Retool } from '@tryretool/custom-component-support'
import {
  ConversationTypes,
  useWeavy,
  WyLinkEventType,
  WyNotifications,
  WyNotificationsEventType
} from '@weavy/uikit-react'
import { useAccessToken, useWeavyUrl } from '../properties/weavy'

import '../styles.css'
import { useOptionalUid } from '../properties/uid'
import {
  useNotificationCount,
  useNotificationDescription,
  useNotificationTitle
} from '../properties/notifications'
import { useThemeStyles } from '../properties/theme'

export const WeavyNotificationEvents: FC = () => {
  const { accessToken } = useAccessToken()
  const { weavyUrl } = useWeavyUrl()
  const { setNotificationCount } = useNotificationCount()
  const { setNotificationTitle } = useNotificationTitle()
  const { setNotificationDescription } = useNotificationDescription()

  Retool.useComponentSettings({
    defaultHeight: 1,
    defaultWidth: 1
  })

  const triggerNotification = Retool.useEventCallback({ name: 'notification' })

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory: async () => accessToken,
    notificationEvents: true
  })

  const updateNotificationCount = async () => {
    if (weavy) {
      // Fetch notification count from the Weavy Web API.
      // See https://www.weavy.com/docs/reference/web-api/notifications#list-notifications

      const queryParams = new URLSearchParams({
        type: '',
        countOnly: 'true',
        unread: 'true'
      })

      // Use weavy.fetch() for fetching from the Weavy Web API to fetch on behalf of the currently authenticated user.
      const response = await weavy.fetch(
        `/api/notifications?${queryParams.toString()}`
      )
      if (response.ok) {
        const result = await response.json()

        // Update the count
        setNotificationCount(result.count)
      }
    }
  }
  const handleNotifications = (e: WyNotificationsEventType) => {
    if (e.detail.notification && e.detail.action === 'notification_created') {
      // Only show notifications when a new notification is received

      // Show notifications using the Retool
      const [title, description] = e.detail.notification.plain.split(':', 2)
      setNotificationTitle(title)
      setNotificationDescription(description)

      triggerNotification()
    }

    // Always update the notification count when notifications updates are received
    updateNotificationCount()
  }

  useEffect(() => {
    if (weavy && weavyUrl && accessToken) {
      // Get initial notification count
      updateNotificationCount()

      // Configure realtime notifications listener
      weavy.notificationEvents = true

      // Add a realtime notification event listener
      weavy.host?.addEventListener('wy:notifications', handleNotifications)

      return () => {
        // Unregister the event listener when the component is unmounted
        weavy.host?.removeEventListener('wy:notifications', handleNotifications)
      }
    }
  }, [weavy, weavyUrl, accessToken])

  return <></>
}

export const WeavyNotifications: FC = () => {
  const { uid } = useOptionalUid()
  const { accessToken } = useAccessToken()
  const { weavyUrl } = useWeavyUrl()
  const { themeStyles }  = useThemeStyles()

  const [_linkData, setLinkData] = Retool.useStateObject({
    name: 'linkData',
    inspector: 'hidden',
    description: 'The data from the most recent link event.'
  })

  const triggerLink = Retool.useEventCallback({ name: 'open-link' })
  const triggerMessenger = Retool.useEventCallback({ name: 'open-messenger' })

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory: async () => accessToken
  })

  const handleLink = (e: WyLinkEventType) => {
    const appType = e.detail.app?.type
    let appUid = e.detail.app?.uid

    setLinkData(e.detail)

    // Check if the appType guid exists in the ConversationTypes map
    if (ConversationTypes.has(appType as string)) {
      // Show the messenger
      triggerMessenger()
    } else if (appUid) {
      // Show a contextual block by navigation to another page

      // The uid should look something like "refine:adb567a"
      // We have embedded base-64 encoded path information in the uid and to use it we need to decode it.
      if (appUid.startsWith('retool:')) {
        triggerLink()
      }
    }
  }

  return <WyNotifications uid={uid} onWyLink={handleLink} style={themeStyles} />
}
