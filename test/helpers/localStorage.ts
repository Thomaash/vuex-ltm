export function getTestAsyncStorageFunctions<Data>(
  type: 'localStorage' | 'sessionStorage'
): {
  setState(key: string, state: Data): void
  getState(key: string): Data | null
  removeState(key: string): void
} {
  return {
    setState(key: string, state: Data): void {
      window[type].setItem(key, JSON.stringify(state))
    },
    getState(key: string): Data | null {
      const str = window[type].getItem(key)
      return str != null ? JSON.parse(str) : null
    },
    removeState(key: string): void {
      window[type].removeItem(key)
    },
  }
}
