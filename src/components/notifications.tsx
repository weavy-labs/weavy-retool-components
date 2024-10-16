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
import {
  useAccessToken,
  useTokenFactory,
  useWeavyOptions,
  useWeavyUrl
} from '../properties/weavy'

import '../styles.css'
import {
  decodeUid,
  useOptionalUid
} from '../properties/uid'
import {
  useNotificationCount,
  useNotificationDescription,
  useNotificationTitle
} from '../properties/notifications'
import { useThemeMode, useThemeStyles } from '../properties/theme'

export const WeavyNotificationEvents: FC = () => {
  const { tokenFactory } = useTokenFactory()
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
    tokenFactory,
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
  const { modeClassName } = useThemeMode()
  const { themeStyles } = useThemeStyles()
  const { weavyUrl } = useWeavyUrl()
  const { tokenFactory } = useTokenFactory()
  const { weavyOptions } = useWeavyOptions()

  const [_linkData, setLinkData] = Retool.useStateObject({
    name: 'linkData',
    initialValue: {},
    inspector: 'hidden',
    description: 'The data from the most recent link event.'
  })

  const [_navigateAppUuid, setNavigateAppUuid] = Retool.useStateString({
    name: 'navigateAppUuid',
    initialValue: '',
    inspector: 'hidden',
    description: 'The Retool app uuid from the most recent link event app.'
  })

  const [_navigateParams, setNavigateParams] = Retool.useStateObject({
    name: 'navigateParams',
    initialValue: {},
    inspector: 'hidden',
    description:
      'The app navigation params from the most recent link event app.'
  })

  const triggerNavigate = Retool.useEventCallback({ name: 'navigate' })
  
  // Reserved for future use
  //const triggerLink = Retool.useEventCallback({ name: 'link' })
  //const triggerMessenger = Retool.useEventCallback({ name: 'open-messenger' })

  const weavy = useWeavy({
    url: weavyUrl,
    tokenFactory,
    ...weavyOptions
  })

  const handleLink = (e: WyLinkEventType) => {
    const appType = e.detail.app?.type
    let appUid = e.detail.app?.uid

    setLinkData(e.detail)

    // Check if the appType guid exists in the ConversationTypes map
    if (ConversationTypes.has(appType as string)) {
      // Show the messenger
      //triggerMessenger()
    } else if (appUid) {
      // Show a contextual block by navigation to another page

      // The uid should look something like "retool:my-chat:abcde-1235:adb567a"
      // We have embedded base-64 encoded path information in the uid and to use it we need to decode it.
      const { uid, appUuid: componentUuid, url } = decodeUid(appUid)
      if (uid) {
        if (url) {
          setNavigateAppUuid(componentUuid)
          setNavigateParams(url)
        } else {
          setNavigateAppUuid('')
          setNavigateParams({})
        }

        triggerNavigate()
      }
    }

    //triggerLink()
  }

  return (
    <WyNotifications
      uid={uid}
      onWyLink={handleLink}
      className={modeClassName}
      style={themeStyles}
    />
  )
}
