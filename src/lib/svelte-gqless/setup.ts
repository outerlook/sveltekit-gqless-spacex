import { getContext, setContext } from 'svelte';
import { createSessionClient, GeneratedSchema } from '../gqless';
import type { GQlessClient, Selection } from 'gqless';

type SelectionHooks = Set<Selection>;
type MountedSelectionHooks = Set<SelectionHooks>;
type GQlessContext = GQlessClient<GeneratedSchema> & { mountedHooks: MountedSelectionHooks };

const GRAPHQL_KEY = {};

export const setClient = () => {
  const client = createSessionClient();
  const mountedHooks = new Set<SelectionHooks>();
  setContext<GQlessContext>(GRAPHQL_KEY, { ...client, mountedHooks });
};

export const getClient = () => {
  return getContext<GQlessContext>(GRAPHQL_KEY);
};

//const createReadableClient = () => {
//   // sets up new cache, etc
//   const client = createSessionClient();
//   return readable<GQlessContext>(client);
// };
// export const client$ = createReadableClient();
