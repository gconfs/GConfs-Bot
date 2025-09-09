# GConfs is watching you 

A Discord bot that monitors RSS feeds and automatically posts new updates to your Discord server channels.

## Features

- Dynamically add and manage RSS feeds.
- Configure public channels to post updates.
- Set up a validation channel for moderating posts before publishing.
- Periodic automated checking of RSS feeds.
- Richly formatted embedded messages for clear presentation.
- Persistent configuration storage using a JSON file.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/gconfs/GConfs-Bot.git
cd GConfs-Bot
```

2. Install dependencies:

```bash
npm install
```

3. Create a Discord bot on the Discord Developer Portal and get your bot token.

4. Update the `.env` file with this template.

``` 
DISCORD_TOKEN="Never gonna give you up"
CLIENT_ID=1234567
GUILD_ID=1234567
```

## Usage

- Use the `/addFeed` command to add new RSS feeds to monitor.
- Use `/setPublicChannel` to set the channel where feed updates will be posted.
- Use `/setValidationChannel` to set the channel used for message moderation.
- The bot will automatically check feeds at intervals and post new items.

## Project Structure

- `commands/` - Discord command handlers for managing feeds and channels.
- `data/config.json` - Persistent configuration storage.
- `events/` - Event handlers for Discord events (ready, interactionCreate, messageCreate).
- `utils/rssMonitor.js` - Module that monitors RSS feeds for updates.

## Contributing

Contributions are welcome! Feel free to submit pull requests to improve the bot.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

***

Developed with ❤️ by [Mr. Vym](https://github.com/MrVym/).
