<div align='center'>
  <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/Snorfield/Scratchie?style=flat&color=%23FFAE00">
  <img alt="GitHub Forks" src="https://img.shields.io/github/forks/Snorfield/Scratchie?style=flat&color=%23FFAE00">
</div>
<h1 align='center'>Scratchie</h1>

General purpose bot for the Scratch Community discord server.

## Usage
> [!IMPORTANT]
> This is not meant to be used in any other server; therefore many ids and other aspects are hard-coded and may not work in a different server. Some functions work in other servers but we do not endorse nor support it.

Firstly, clone the repo.
```bash
git clone https://github.com/Snorfield/Scratchie.git
```

Ensure to replace the credential fields in `config.json` before moving on with the instructions. 
If you were able to setup `config.json`, skip this step below and move on to 'Running The Bot'.
### Setting Up config.json
1. Go to [Discord Developer Portal](https://discord.com/developers/home) and sign-in if needed. Once you are in, if you have already added an app, click your app. If not, make a new app.
2. Add your bot to a server if you haven't already. (If not, go to 'OAuth2' section of your bot, click
   'Bot' scope and add whatever permissions you need and copy link and paste it in browser)
3. Add bot token, client id and guild id. (Logging webhook is not required)
### Running The Bot
Run in a terminal of your choice:
```bash
npm install
node register.js
node index.js
```

The bot should be online after this.
## Commands
```
View new quality projects via the ScratchExplore API
/explore

View the latest articles from the Scratch Team
/news

View a preview of the specified user's Scratch profile
/profile <username>

View a preview of the specified project
/project <id>

View a preview of the specified studio
/studio <id>

Show a short preview of a rule (reserved for staff)
/rule <rule>

*Commands shown may not reflect current list of commands
```

## Developers & Contributors
### Developers
Thanks to all our great developers!
- **Snorfield**: Maintainer, reviewer and engineering lead
- **rosics-code**: Developer
- **josh-cubed**: Reviewer and developer
### Contributors
Thanks to all our great contributors!
- **raynepaws**: Periodic contributor
- **thecolorbluu**: Periodic contributor

And special thanks to **man-o-valor** for hosting the bot!
