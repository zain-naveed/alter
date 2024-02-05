import * as React from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

export function useBlocker(blocker: any, when = true): void {
  const navigator: any = React.useContext(UNSAFE_NavigationContext).navigator;

  React.useEffect(() => {
    if (!when) return;

    const unblock = navigator?.block((tx: any) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}
