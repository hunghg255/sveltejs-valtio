# sveltejs-valtio

State management solution for Svelte using proxies. Powered by [valtio](https://github.com/pmndrs/valtio).

## Demo

[Demo](https://stackblitz.com/edit/vitejs-vite-kz7hyk?file=src%2FApp.svelte)

## Installation

```sh
npm i sveltejs-valtio
```

## Usage

```ts
// store.ts
import { proxy } from 'sveltejs-valtio';

export const state = proxy({ count: 0 });
```

Read from snapshots, mutate the source.

```svelte
<script lang="ts">
  import { useSnapshot } from 'sveltejs-valtio'
  import { state } from './store'
  const snap = useSnapshot(state)
</script>

<button on:click={() => state.count++}>
  Clicks: {$snap.count}
</button>
```

## Utilities

### `derive`

You can subscribe to some proxies and create a derived proxy.

```ts
import { derive } from 'sveltejs-valtio';

// create a base proxy
const state = proxy({
  count: 1,
});

// create a derived proxy
const derived = derive({
  doubled: (get) => get(state).count * 2,
});

// alternatively, attach derived properties to an existing proxy
derive(
  {
    tripled: (get) => get(state).count * 3,
  },
  {
    proxy: state,
  },
);
```

### `proxyWithComputed`

You can define own computed properties within a proxy. By combining with a memoization library such as [proxy-memoize](https://github.com/dai-shi/proxy-memoize), optimizing function calls is possible.

```ts
import memoize from 'proxy-memoize';
import { proxyWithComputed } from 'sveltejs-valtio';

const state = proxyWithComputed(
  {
    count: 1,
  },
  {
    doubled: memoize((snap) => snap.count * 2),
  },
);

// Computed values accept custom setters too:
const state2 = proxyWithComputed(
  {
    firstName: 'Alec',
    lastName: 'Baldwin',
  },
  {
    fullName: {
      get: memoize((snap) => `${snap.firstName} ${snap.lastName}`),
      set: (state, newValue) => {
        [state.firstName, state.lastName] = newValue.split(' ');
      },
    },
  },
);

// if you want a computed value to derive from another computed, you must declare the dependency first:
const state = proxyWithComputed(
  {
    count: 1,
  },
  {
    doubled: memoize((snap) => snap.count * 2),
    quadrupled: memoize((snap) => snap.doubled * 2),
  },
);
```

### `proxyWithHistory`

This is a utility function to create a proxy with snapshot history.

```ts
import { proxyWithHistory } from 'sveltejs-valtio';

const state = proxyWithHistory({ count: 0 });
console.log(state.value); // ---> { count: 0 }
state.value.count += 1;
console.log(state.value); // ---> { count: 1 }
state.undo();
console.log(state.value); // ---> { count: 0 }
state.redo();
console.log(state.value); // ---> { count: 1 }
```
