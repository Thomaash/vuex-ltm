/**
 * Manages execution of passed functions (e.g. avoiding bursts by skipping some).
 *
 * @param func - Function to be executed (may be thrown away and never executed).
 *
 * @public
 */
export type Executor = (func: Function) => void

/**
 * Persists the state immediatelly.
 *
 * @public
 */
export const simplyExecute: Executor = (f): void => {
  f()
}

/**
 * Configures an [[Executor]] that delays state persisting some time after the last change.
 *
 * @param ms - Time to wait before persisting in milliseconds.
 * @returns Configured [[Executor]]
 *
 * @public
 */
export function executeWithDelay(ms: number): Executor {
  let timeout: number | null = null

  function onBeforeunload(e: BeforeUnloadEvent): void {
    e.preventDefault() // Cancel the event
    e.returnValue = '' // Chrome requires returnValue to be set
  }

  return function(func): void {
    if (timeout == null) {
      // Starting a new timeout
      window.addEventListener('beforeunload', onBeforeunload)
    } else {
      // Replacing existing timeout
      window.clearTimeout(timeout)
    }

    timeout = window.setTimeout((): void => {
      func()
      timeout = null
      window.removeEventListener('beforeunload', onBeforeunload)
    }, ms)
  }
}
