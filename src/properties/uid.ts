import { Retool } from '@tryretool/custom-component-support'

export const useUid = () => {
  const [uid] = Retool.useStateString({
    name: 'uid',
    description: 'The uid of the chat block.'
  })
  return { uid }
}

export const useOptionalUid = () => {
  const [uid] = Retool.useStateString({
    name: 'uid',
    label: 'UID (optional)',
    description: 'Optional uid to display notifications for.'
  })
  return { uid }
}
