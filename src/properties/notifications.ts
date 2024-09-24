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
