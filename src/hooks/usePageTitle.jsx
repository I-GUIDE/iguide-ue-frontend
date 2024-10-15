import { useRef, useEffect } from "react";

/**
 * Set page title on browser tabs dynamically
 * @function usePageTitle
 * @param {string} title - The title of the page
 * @param {boolean} [usePostfix = true] - Option whether using the postfix aka default website name. Optional.
 * @param {boolean} [prevailOnUnmount = false]
 */
export default function usePageTitle(
  title,
  usePostfix = true,
  prevailOnUnmount = false
) {
  const defaultTitle = useRef(document.title);
  const postfix = import.meta.env.VITE_WEBSITE_TITLE;

  useEffect(() => {
    if (usePostfix) {
      // When the requested title is empty, don't use dash
      if (title === "") {
        document.title = postfix;
      } else {
        document.title = title + " - " + postfix;
      }
    } else {
      document.title = title;
    }
  }, [title, postfix, usePostfix]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    [prevailOnUnmount]
  );
}
