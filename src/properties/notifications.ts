import { Retool } from '@tryretool/custom-component-support'

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
    inspector: 'hidden',
    description: 'The title of the most recent notification event.'
  })
  return { setNotificationTitle }
}

export const useNotificationDescription = () => {
  const [_notificationDescription, setNotificationDescription] =
    Retool.useStateString({
      name: 'notificationDescription',
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
    inspector: 'select',
    initialValue: 'count'
  })
  return {
    notifications: <'button-list' | 'none'>(enableNotifications ? 'button-list' : 'none'),
    notificationsBadge: <'count' |'dot' | 'none'>notificationsBadge
  }
}
