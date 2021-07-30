## Experimental example
This was created to give example of working with gqless and svelte.
Windicss was added for convenience.

## [GQless](https://gqless.com/) svelte integration is not complete
I've got some more helpers functions around mutations and subscriptions that weren't added to this repo to be simple. But I sure may release a svelte binding I've being developing. 
And I am building sort of a Suspense component that will hide the `undefined` state of the accessed elements.

## Starting server
```bash
pnpm run dev
```


## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
pnpm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
