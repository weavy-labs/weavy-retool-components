import { Retool } from '@tryretool/custom-component-support'
import { AppWithPageType } from '../components/notifications'
import { useCallback } from 'react'

export type OpenAppParameters = {
  pageName?: string
  queryParams?: {
    [k: string]: string
  }
  hashParams?: {
    [k: string]: string
  }
}

export type PageDataType = OpenAppParameters & {
  appUuid?: string
}

export const useNotificationCount = () => {
  const [_notificationCount, setNotificationCount] = Retool.useStateNumber({
    name: 'notificationCount',
    initialValue: 0,
    inspector: 'hidden',
    description: 'The number of unread notifications.'
  })
  return { setNotificationCount }
}

export const useNotificationTitle = () => {
  const [_notificationTitle, setNotificationTitle] = Retool.useStateString({
    name: 'notificationTitle',
    initialValue: '',
    inspector: 'hidden',
    description: 'The title of the most recent notification event.'
  })
  return { setNotificationTitle }
}

export const useNotificationDescription = () => {
  const [_notificationDescription, setNotificationDescription] =
    Retool.useStateString({
      name: 'notificationDescription',
      initialValue: '',
      inspector: 'hidden',
      description: 'The description of the most recent notification event.'
    })
  return { setNotificationDescription }
}

export const useNotificationProps = () => {
  const [enableNotifications] = Retool.useStateBoolean({
    name: 'enableNotifications',
    label: 'Notifications button',
    inspector: 'checkbox',
    initialValue: true
  })

  const [notificationsBadge] = Retool.useStateEnumeration({
    name: 'notificationBadge',
    label: 'Notifications badge',
    enumDefinition: ['count', 'dot', 'none'],
    enumLabels: { count: 'Number', dot: 'Dot', none: 'None' },
    inspector: 'select',
    initialValue: 'count'
  })

  return {
    notifications: <'button-list' | 'none'>(
      (enableNotifications ? 'button-list' : 'none')
    ),
    notificationsBadge: <'count' | 'dot' | 'none'>notificationsBadge
  }
}

type WyAppRef = HTMLElement & { whenApp: () => Promise<AppWithPageType> } | null

export const useNavigationEventCallback = (deps: React.DependencyList) => {
  const triggerNotification = Retool.useEventCallback({
    name: 'SetWeavyNavigation'
  })

  const navigationRefCallBack = useCallback((weavyComponent: WyAppRef) => {
    if (weavyComponent) {
      requestAnimationFrame(() => {
        weavyComponent.whenApp().then((app: AppWithPageType) => {
          if (!app.metadata?.page) {
            //console.debug("Triggering SetWeavyNavigation", app.uid)
            triggerNotification()
          }
        })
      })
    }
  }, [...deps])

  return { navigationRefCallBack }
}
