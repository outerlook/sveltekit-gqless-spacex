import type { Selection } from 'gqless';
import { getClient } from './setup';

function createInterceptWrapper(hookSelections: Set<Selection>, options = { debug: false }) {
  const { interceptorManager } = getClient();
  // const { interceptorManager } = get(client$);

  const wrapIntercept = (fn: () => any) => {
    const interceptor = interceptorManager.createInterceptor();

    interceptor.selectionAddListeners.add((selection) => {
      if (selection) hookSelections.add(selection);
    });
    interceptor.selectionCacheListeners.add((selection) => {
      if (selection) hookSelections.add(selection);
    });
    interceptor.selectionCacheRefetchListeners.add((selection) => {
      if (selection) hookSelections.add(selection);
    });

    const value = fn();
    interceptorManager.removeInterceptor(interceptor);
    return value;
  };
  return wrapIntercept;
}

export function interceptSelectionsOfProxy<T extends object>(initialProxy: T, options = { debug: false }) {
  const {
    accessorCache: { isProxy },
  } = getClient();

  const hookSelections = new Set<Selection>();

  const wrapIntercept = createInterceptWrapper(hookSelections, options);

  const proxyFnHandler: ProxyHandler<{}> = {
    apply(target: any, thisArg: any, argArray: any[]): any {
      const returnValue = wrapIntercept(() => Reflect.apply(target, thisArg, argArray));

      if (!isProxy(returnValue)) {
        return returnValue;
      }

      return new Proxy(returnValue, handler);
    },
  };
  const handler: ProxyHandler<{}> = {
    set(target, key, value) {
      return Reflect.set(target, key, value);
    },
    get(target, key, receiver) {
      const returnValue = wrapIntercept(() => Reflect.get(target, key, receiver));
      if (!isProxy(returnValue)) {
        if (typeof returnValue !== 'function') {
          // provavelmente um scalar
          return returnValue;
        }
        // deve ser funcao
        return new Proxy(returnValue, proxyFnHandler);
      }

      return new Proxy(returnValue, handler);
    },
  };

  const initialHandler = typeof initialProxy === 'function' ? proxyFnHandler : handler;

  const proxy = new Proxy<T>(initialProxy, initialHandler);
  return { proxy, hookSelections };
}
