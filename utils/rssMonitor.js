const RSSParser = require("rss-parser");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "..", "data", "config.json");
const parser = new RSSParser();

async function fetchFeeds(client) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (!config.validationChannelId) return;

  console.log("Fetching RSS flux");

  for (const url of config.rssFeeds) {
    try {
      const feed = await parser.parseURL(url);

      for (const item of feed.items) {
        if (config.sentPosts.includes(item.link)) continue;

        const news = {
          guid: item.guid,
          title: item.title,
          link: item.link,
          date: item.pubDate,
          url,
        };

        config.sentPosts.push(news.link);
        config.pendingPosts.push(news);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const validationChannel = await client.channels.fetch(config.validationChannelId);
        if (!validationChannel) continue;

        const message = await validationChannel.send({
          content: `Nouvelle annonce à valider :\n**${news.title}**\n${news.link}`,
        });

        await message.react("✅");
        await message.react("❌");

        const filter = (reaction, user) =>
          ["✅", "❌"].includes(reaction.emoji.name) && !user.bot;

        const collector = message.createReactionCollector({
          filter,
          max: 1,
          time: 5 * 60 * 1000,
        });

        collector.on("collect", async (reaction, user) => {
          const updatedConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
          const index = updatedConfig.pendingPosts.findIndex(p => p.guid === news.guid);
          if (index === -1) {
            await message.channel.send("Annonce déjà traitée.");
            return;
          }

          const [pending] = updatedConfig.pendingPosts.splice(index, 1);

          if (reaction.emoji.name === "✅") {
            if (updatedConfig.publicChannelId) {
              const publicChannel = await client.channels.fetch(updatedConfig.publicChannelId);
              if (publicChannel) {
                await publicChannel.send({
                  content: `Annonce validée par ${user} :\n**${pending.title}**\n${pending.link}`,
                });
              } 
            }
          }

          fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));

          await message.delete();
          collector.stop();
        });

        collector.on("end", (collected) => {
          if (collected.size === 0) {
            message.reply("Temps écoulé, annonce non validée.");
          }
        });
      }
    } catch (error) {
      console.error(`Erreur lors de la lecture du flux ${url} :`, error);
    }
  }
}

function startMonitoring(client, interval = 5 * 60 * 1000) {
  fetchFeeds(client);
  setInterval(() => fetchFeeds(client), interval);
}

module.exports = { startMonitoring };
