import { lazy } from "react";

/**
 * Lazy load with retry and reload fallback.
 *
 * @param {() => Promise<any>} factory - the dynamic import function
 * @param {number} delay - delay between retries in ms (default: 500)
 * @param {number} retryTimes - number of retry attempts before reload (default: 1)
 * @param {number} reloadTimes - max number of page reloads (default: 1)
 */
export function lazyWithRetryAndReload(
  factory,
  delay = 500,
  retryTimes = 1,
  reloadTimes = 1
) {
  let retryCount = 0;

  // Check if this is a post-reload load attempt
  const reloadCount = Number(sessionStorage.getItem("lazyReloadCount") || "0");
  if (reloadCount > 0) {
    // This is the load after a reload, clear the counter
    sessionStorage.removeItem("lazyReloadCount");
  }

  async function attemptImport() {
    try {
      const module = await factory();
      return module;
    } catch (error) {
      if (retryCount < retryTimes) {
        retryCount++;
        console.warn(
          `Lazy import failed. Retrying (${retryCount}/${retryTimes}) in ${delay}ms`,
          error
        );

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            attemptImport().then(resolve).catch(reject);
          }, delay);
        });
      }

      if (reloadCount < reloadTimes) {
        sessionStorage.setItem("lazyReloadCount", String(reloadCount + 1));
        console.error(
          `Retry failed. Reloading the page... (reload ${
            reloadCount + 1
          }/${reloadTimes})`,
          error
        );
        window.location.reload();

        return new Promise(() => {});
      }

      console.error(
        "Reload limit reached. Not retrying or reloading again.",
        error
      );
      return await Promise.reject(error);
    }
  }

  return lazy(() => attemptImport());
}
