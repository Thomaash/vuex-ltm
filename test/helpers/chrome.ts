/* global chrome: false */

interface Items<Data> {
  [key: string]: Data
}
interface Result<Data> {
  [key: string]: Data | undefined
}

export function getTestAsyncStorageFunctions<Data>(
  type: 'local' | 'sync'
): {
  setState(key: string, state: Data): Promise<void>
  getState(key: string): Promise<Data | null>
  removeState(key: string): Promise<void>
  mockChromeStorage(): void
} {
  return {
    setState(key: string, state: Data): Promise<void> {
      return new Promise((resolve): void => {
        chrome.storage[type].set({ [key]: state }, resolve)
      })
    },
    getState(key: string): Promise<Data | null> {
      return new Promise((resolve): void => {
        chrome.storage[type].get([key], (result): void => {
          const value = result[key]
          resolve(value != null ? value : null)
        })
      })
    },
    removeState(key: string): Promise<void> {
      return new Promise((resolve): void => {
        chrome.storage[type].remove([key], resolve)
      })
    },
    mockChromeStorage(): void {
      const map = new Map<string, Data>()
      ;(global as any).chrome = {
        storage: {
          [type]: {
            set(items: Items<Data>, callback: () => void): void {
              Object.entries(items).forEach(([key, value]): void => {
                map.set(key, value)
              })
              callback()
            },
            get(
              keys: string[],
              callback: (result: Result<Data>) => void
            ): void {
              const result: Result<Data> = {}

              keys.forEach((key): void => {
                result[key] = map.get(key)
              })

              callback(result)
            },
            remove(keys: string[], callback: () => void): void {
              keys.forEach((key): void => {
                map.delete(key)
              })
              callback()
            },
          },
        },
      }
    },
  }
}
