import { Retool } from '@tryretool/custom-component-support'

const extractPath = (url: string) => {
  const baseUrl = new URL('.', url)
  const relPath = url.split(baseUrl.pathname, 2)[1]
  return { baseUrl: baseUrl.href, relPath }
}

export const getComponentParams = (componentUrl: string | URL) => {
  const url = new URL(componentUrl)

  const hash = url.hash.substring(1)
  const hashQueryParams = new URLSearchParams(hash)

  const queryParams = Object.fromEntries(url.searchParams.entries())
  const hashParams = Object.fromEntries(hashQueryParams.entries())

  return {
    queryParams,
    hashParams
  }
}

export const useUid = () => {
  const [uid] = Retool.useStateString({
    name: 'uid',
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

export const useComponentPath = () => {
  const [componentUrl] = Retool.useStateString({
    name: 'componentPath',
    description: 'The href of the component.',
    initialValue: '{{ urlparams.href }}',
    inspector: 'hidden'
  })

  let relPath = ''
  let baseUrl = ''
  let componentParams = {}

  if (componentUrl) {
    ;({ relPath, baseUrl } = extractPath(componentUrl))
    componentParams = getComponentParams(componentUrl)
  }
  return { componentPath: relPath, baseUrl, componentParams }
}

export const useEncodedUid = () => {
  const { componentPath } = useComponentPath()
  const { uid } = useUid() || ''

  const encodedUid = `retool:${uid}:${btoa(componentPath)}`

  return { encodedUid }
}

export const decodeUid = (encodedUid: string) => {
  if (encodedUid.startsWith('retool:')) {
    const [_prefix, uid, encodedPath] = encodedUid.split(':')
    return { uid, path: atob(encodedPath) }
  }
  return { uid: undefined, path: undefined }
}
