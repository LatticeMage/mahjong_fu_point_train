# Svelte Static Site Template

template for build svelte 5 static site with vite 6


## svelte env

essential dep
```
npm install -D @sveltejs/adapter-static
```

```
// src/routes/+layout.js
export const prerender = true;
```

other resource:
* https://svelte.dev/docs/kit/adapter-static


## other usage

support vite-node