import { Retool } from '@tryretool/custom-component-support'

export type OpenAppParameters = {
  pageName?: string
  queryParams?: {
    [k: string]: string
  }
  hashParams?: {
    [k: string]: string
  }
}

export const useName = () => {
  const [name] = Retool.useStateString({
    name: 'name',
    label: "Display name",
    description: 'The display name of the component. Used in notifications etc.'
  })

  return { name: name || undefined }
}

export const useUid = () => {
  const [uid] = Retool.useStateString({
    name: 'uid',
    initialValue: '{{ self.id }}',
    description: 'The uid of the component.'
  })

  return { uid }
}

export const useOptionalUid = () => {
  const [uid] = Retool.useStateString({
    name: 'uid',
    label: 'UID (optional)',
    description: 'Optional uid for filtering.'
  })

  return { uid }
}

export const useAppUuid = () => {
  const [appUuid] = Retool.useStateString({
    name: 'appUuid',
    description: 'The uuid of the app.',
    initialValue: '{{ retoolContext.appUuid }}',
    inspector: 'hidden'
  })
  return { appUuid }
}

export const useUrl = () => {
  const [currentPage] = Retool.useStateString({
    name: 'currentPage',
    description: 'The currentPage of the app.',
    initialValue: '{{ retoolContext.currentPage }}',
    inspector: 'hidden'
  })
  const [componentUrl] = Retool.useStateString({
    name: 'componentUrl',
    description: 'The url params of the current page.',
    initialValue: '{{ urlparams.href || url.href }}',
    inspector: 'hidden'
  })

  const url = new URL(componentUrl);

  const pageName = currentPage || undefined
  const queryParams = Object.fromEntries(url.searchParams.entries())
  const hashParams = Object.fromEntries(url.hash ? new URLSearchParams(url.hash.substring(1)).entries() : [])

  const componentParams = <OpenAppParameters>{
    pageName,
    queryParams,
    hashParams
  }

  return { url: componentParams }
}

export const useEncodedUid = (initialValue?: string) => {
  const { appUuid } = useAppUuid()
  const { url } = useUrl()
  const { uid } = useUid() || initialValue || ''

  const encodedUid = `retool:${uid}:${appUuid}:${btoa(JSON.stringify(url))}`

  const [_encodedUid, setEncodedUid] = Retool.useStateString({
    name: 'encodedUid',
    initialValue: '',
    inspector: 'hidden',
    description: 'The encoded uid for the Weavy component.'
  })

  setEncodedUid(encodedUid)

  return { encodedUid }
}

export const decodeUid = (encodedUid: string) => {
  if (encodedUid.startsWith('retool:')) {
    const [_prefix, uid, appUuid, encodedUrl] = encodedUid.split(':', 4)
    return { uid, appUuid, url: JSON.parse(atob(encodedUrl)) }
  }
  return { uid: undefined, appUuid: undefined, url: undefined }
}
