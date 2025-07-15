## refrig

Too many leftovers in my fridge, so I asked Claude to build a fun website to generate some recipes for me. The frontend is built with React + Vite and deployed to Cloudflare Pages. Recipe generation is handled by streaming responses from Workers AI. I did not write this code, Claude did.

----

This was built iteratively with Claude Code with minimal programming - I only had to step in to rewrite some of the SSE handlers, maybe because it needed Workers AI specific handling and that might have thrown Claude off. I used up most of the context window, but asked [Claude to generate a definitive prompt](prompt.md) that would build a (much closer single take) version of this app next time.