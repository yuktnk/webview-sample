export type NativeBridge = {
  onClickClose: () => void
  sendTrack: (params: string) => void
}

const getBridge = (): NativeBridge => {
  if (typeof window === 'undefined') throw new Error('window is undefined')

  // Android
  if ('MebViewInterface' in window) {
    return window.MebViewInterface as NativeBridge
  }

  // iOS
  if ('webkit' in window) {
    const webkit = window.webkit as {
      messageHandlers: Record<
        string,
        { postMessage: (params?: string) => void }
      >
    }
    return {
      onClickClose: () => webkit.messageHandlers['onClickClose']?.postMessage(),
      sendTrack: (params) =>
        webkit.messageHandlers['sendTrack']?.postMessage(params),
    }
  }

  throw new Error('NativeBridge is not available')
}

export const getNativeBridge = (): NativeBridge => getBridge()
