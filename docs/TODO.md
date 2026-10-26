# TODO

## Important
- Port JSON components V2 structures to proper Discord.js Components V2 builders
- Fix possible network race conditions for the advertisement deletion function. In some insane universe, we could call `delete()` before `reply()` goes through. This could occur if the request to reply hangs for just long enough. In this instance, the bot would probably crash. It will automatically restart, but I still don't like it.

## Medium
- Rewrite to ESM JavaScript
- Refactor redundant code. All role snowflakes should be moved to a single JSON file, and all channels should be mapped in a JSON file with their snowflake id. This way we can actually just import the channels from anywhere we need it.

## Cosmetic
- New status messages (maybe we could make this a server event to come up with status messages)
- Bot banner (this could also be a server event)
