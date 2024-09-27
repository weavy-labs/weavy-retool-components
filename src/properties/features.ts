import { Retool } from '@tryretool/custom-component-support'

export const useAttachmentsFeature = () => {
  const [enableAttachments] = Retool.useStateBoolean({
    name: 'enableAttachments',
    label: 'Attachments',
    inspector: "checkbox",
    initialValue: true
  })
  return { noAttachments: enableAttachments === false }
}

export const useCloudFilesFeature = () => {
  const [enableCloudFiles] = Retool.useStateBoolean({
    name: 'enableCloudFiles',
    label: 'Cloud Files',
    inspector: "checkbox",
    initialValue: true
  })
  return { noCloudFiles: enableCloudFiles === false }
}

export const useMeetingsFeature = () => {
  const [enableMeetings] = Retool.useStateBoolean({
    name: 'enableMeetings',
    label: 'Meetings',
    inspector: "checkbox",
    initialValue: true,
  })
  return { noMeetings: enableMeetings === false }
}

export const useMentionsFeature = () => {
  const [enableMentions] = Retool.useStateBoolean({
    name: 'enableMentions',
    label: 'Mentions',
    inspector: "checkbox",
    initialValue: true
  })
  return { noMentions: enableMentions === false }
}

export const usePollsFeature = () => {
  const [enablePolls] = Retool.useStateBoolean({
    name: 'enablePolls',
    label: 'Polls',
    inspector: "checkbox",
    initialValue: true
  })
  return { noPolls: enablePolls === false }
}

export const usePreviewsFeature = () => {
  const [enablePreviews] = Retool.useStateBoolean({
    name: 'enablePreviews',
    label: 'Previews',
    inspector: "checkbox",
    initialValue: true
  })
  return { noPreviews: enablePreviews === false }
}

export const useReactionsFeature = () => {
  const [enableReactions] = Retool.useStateBoolean({
    name: 'enableReactions',
    label: 'Reactions',
    inspector: "checkbox",
    initialValue: true
  })
  return { noReactions: enableReactions === false }
}

export const useCommentsFeature = () => {
  const [enableComments] = Retool.useStateBoolean({
    name: 'enableComments',
    label: 'Comments',
    inspector: "checkbox",
    initialValue: true
  })
  return { noComments: enableComments === false }
}

export const useVersionsFeature = () => {
  const [enableVersions] = Retool.useStateBoolean({
    name: 'enableVersions',
    label: 'Versions',
    inspector: "checkbox",
    initialValue: true
  })
  return { noVersions: enableVersions === false }
}

export const useWebDAVFeature = () => {
  const [enableWebDAV] = Retool.useStateBoolean({
    name: 'enableWebDAV',
    label: 'WebDav',
    inspector: "checkbox",
    initialValue: true
  })
  return { noWebDAV: enableWebDAV === false }
}

export const useEmbedsFeature = () => {
  const [enableEmbeds] = Retool.useStateBoolean({
    name: 'enableEmbeds',
    label: 'Embeds',
    inspector: "checkbox",
    initialValue: true
  })
  return { noEmbeds: enableEmbeds === false }
}

export const useReceiptsFeature = () => {
  const [enableReceipts] = Retool.useStateBoolean({
    name: 'enableReceipts',
    label: 'Receipts',
    inspector: "checkbox",
    initialValue: true
  })
  return { noReceipts: enableReceipts === false }
}

export const useTypingFeature = () => {
  const [enableTyping] = Retool.useStateBoolean({
    name: 'enableTyping',
    label: 'Typing',
    inspector: "checkbox",
    initialValue: true
  })
  return { noTyping: enableTyping === false }
}

export const useChatFeatures = () => {
  const features = {
    ...useAttachmentsFeature(),
    ...useCloudFilesFeature(),
    ...useMeetingsFeature(),
    ...useMentionsFeature(),
    ...usePollsFeature(),
    ...usePreviewsFeature(),
    ...useReactionsFeature()
  }
  return features
}

export const useCommentsFeatures = () => {
  const features = {
    ...useAttachmentsFeature(),
    ...useCloudFilesFeature(),
    ...useMeetingsFeature(),
    ...useMentionsFeature(),
    ...usePreviewsFeature(),
    ...useReactionsFeature()
  }
  return features
}

export const useFilesFeatures = () => {
  const features = {
    ...useAttachmentsFeature(),
    ...useCloudFilesFeature(),
    ...useMentionsFeature(),
    ...usePreviewsFeature(),
    ...useReactionsFeature(),
    ...useCommentsFeature(),
    ...useVersionsFeature(),
    ...useWebDAVFeature(),
  }
  return features
}

export const usePostsFeatures = () => {
  const features = {
    ...useAttachmentsFeature(),
    ...useCloudFilesFeature(),
    ...useEmbedsFeature(),
    ...useMeetingsFeature(),
    ...useMentionsFeature(),
    ...usePreviewsFeature(),
    ...useReactionsFeature(),
    ...usePollsFeature(),
    ...useCommentsFeature(),
  }
  return features
}

export const useMessengerFeatures = () => {
  const features = {
    ...useAttachmentsFeature(),
    ...useCloudFilesFeature(),
    ...useMeetingsFeature(),
    ...useMentionsFeature(),
    ...usePollsFeature(),
    ...usePreviewsFeature(),
    ...useReactionsFeature(),
    ...useReceiptsFeature(),
    ...useTypingFeature(),
  }
  return features
}

