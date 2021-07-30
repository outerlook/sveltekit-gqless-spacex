import { readable } from 'svelte/store';
import { interceptSelectionsOfProxy } from './proxy';
import type { EventHandler, Selection } from 'gqless';
import { getClient } from './setup';

// This is a integration layer between gqless core and svelte (stores)
export const createReadableQuery = (debug = false) => {
  const { query, mountedHooks, eventHandler } = getClient();
  const clientQuery = query;
  const { proxy: proxiedQuery, hookSelections } = interceptSelectionsOfProxy(clientQuery);

  let isActive = false;
  let unsubscribeToCacheChanges: () => void | undefined;
  return readable(proxiedQuery, (set) => {
    if (!isActive) {
      mountedHooks.add(hookSelections);
      unsubscribeToCacheChanges = subscribeToCacheChanges({
        hookSelections,
        eventHandler,
        onChange: () => set(proxiedQuery),
      });
    }
    isActive = true;

    const unsubscribe = () => {
      isActive = false;
      unsubscribeToCacheChanges?.();
      mountedHooks.delete(hookSelections);
    };
    return unsubscribe;
  });
};

export function subscribeToCacheChanges({
  hookSelections,
  eventHandler,
  onChange,
}: {
  hookSelections: Set<Selection>;
  eventHandler: EventHandler;
  onChange: () => void;
}) {
  const unsubscribeFetch = eventHandler.onFetchSubscribe((fetchPromise, promiseSelections) => {
    if (!promiseSelections.some((selection) => hookSelections.has(selection))) {
      return;
    }

    fetchPromise.then(
      () => {
        Promise.resolve(fetchPromise).then(onChange);
      },
      () => {},
    );
  });

  const unsubscribeCache = eventHandler.onCacheChangeSubscribe(({ selection }) => {
    if (hookSelections.has(selection)) {
      Promise.resolve().then(onChange);
    }
  });

  const unsubscribe = () => {
    unsubscribeFetch();
    unsubscribeCache();
  };
  return unsubscribe;
}
