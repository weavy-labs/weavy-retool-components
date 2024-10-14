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

// Match retool url paths starting with /app/... or /editor/...
const pathRegex =
  /\/(app\/[^#\?\/]+|editor\/[^\/]+\/[^#\?\/]+)\/?(?<relPath>.*)$/

// Extracts pageName, search and hash from a relPath
const relRegex =
  /\/?(?<pageName>[^\/?#]*)([?](?<search>[^#]*))?(#(?<hash>[^#]*))?$/

const extractPath = (url: string) => {
  const result = url.match(pathRegex)
  let relPath = ''

  if (result && result?.groups?.relPath) {
    relPath = result?.groups?.relPath
  } else {
    // Fallback extraction
    const baseUrl = new URL('.', url)
    relPath = url.split(baseUrl.pathname, 2)[1]
  }

  return { relPath }
}

export const getComponentParams = (relPath: string) => {
  const result = relPath.match(relRegex)

  if (!result || !result.groups) {
    throw Error('Invalid relPath')
  }

  const pageName = result.groups.pageName || undefined

  const searchQueryParams = new URLSearchParams(result.groups.search)
  const hashQueryParams = new URLSearchParams(result.groups.hash)

  const queryParams = Object.fromEntries(searchQueryParams.entries())
  const hashParams = Object.fromEntries(hashQueryParams.entries())

  return <OpenAppParameters>{
    pageName,
    queryParams,
    hashParams
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

export const useComponentPath = () => {
  const [componentUrl] = Retool.useStateString({
    name: 'componentPath',
    description: 'The href of the component.',
    initialValue: '{{ urlparams.href }}',
    inspector: 'hidden'
  })

  let relPath = ''
  let componentParams = {}

  if (componentUrl) {
    relPath = extractPath(componentUrl).relPath
    componentParams = getComponentParams(relPath)
  }
  return { componentPath: relPath, componentParams }
}

export const useEncodedUid = (initialValue?: string) => {
  const { appUuid } = useAppUuid()
  const { componentPath } = useComponentPath()
  const { uid } = useUid() || initialValue || ''

  const encodedUid = `retool:${uid}:${appUuid}:${btoa(componentPath)}`

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
    const [_prefix, uid, appUuid, encodedPath] = encodedUid.split(':', 4)
    return { uid, appUuid, relPath: atob(encodedPath) }
  }
  return { uid: undefined, appUuid: undefined, relPath: undefined }
}
