# Contributing
We allow users to contribute to this repository and such. When you contribute, please be mindful of some things we enforce such as:
1. Do not use AI - We will not accept your PR if it contains various (if not all) AI-generated media.
2. Know what you coded - We won't accept your PR if you don't even know what you did!
3. Do not spam PRs - It clogs our workflow.
4. Make meaningful changes - Ask yourself: "Why is this necessary to Scratchie?", "What value does this have?"
5. Clear commit names - Try to follow [The Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for help.
   
## TODO

### Important
- Port JSON components V2 structures to proper Discord.js Components V2 builders
- Fix possible network race conditions for the advertisement deletion function. In some insane universe, we could call `delete()` before `reply()` goes through. This could occur if the request to reply hangs for just long enough. In this instance, the bot would probably crash. It will automatically restart, but I still don't like it.

### Medium
- Rewrite to ESM JavaScript
- Refactor redundant code. All role snowflakes should be moved to a single JSON file, and all channels should be mapped in a JSON file with their snowflake id. This way we can actually just import the channels from anywhere we need it.

### Cosmetic
- Bot banner (this could be a server event)
