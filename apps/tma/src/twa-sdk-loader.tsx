import { PropsWithChildren, useMemo } from "react";
import { useSDK } from "@twa.js/sdk-react";

export function TWASDKLoader({ children }: PropsWithChildren) {
  const { didInit, components, error } = useSDK();
  const errorMessage = useMemo<null | string>(() => {
    if (!error) {
      return null;
    }

    return error instanceof Error ? error.message : "Unknown error";
  }, [error]);

  if (!didInit) {
    return <div>SDK init function is not yet called.</div>;
  }

  if (error !== null) {
    return (
      <>
        <p>
          SDK was unable to initialize. Probably, current application is being
          used not in Telegram Web Apps environment.
        </p>
        <blockquote>
          <p>{errorMessage}</p>
        </blockquote>
      </>
    );
  }

  if (components === null) {
    return <div>Loading..</div>;
  }

  return <>{children}</>;
}
