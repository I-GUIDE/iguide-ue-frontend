import { useRouteError } from "react-router-dom";
import usePageTitle from "./hooks/usePageTitle";

export default function Error(props) {
  usePageTitle("Error");

  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <p>
        Go back to <a href="/">home page</a>.
      </p>
    </div>
  );
}
