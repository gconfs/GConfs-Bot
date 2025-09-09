const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "..", "data", "config.json");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (message.channel.id !== config.validationChannelId) return;

    if (message.content.toLowerCase() === "valider") {
      const pending = config.pendingPosts.shift();

      if (pending && config.publicChannelId) {
        const publicChannel = await client.channels.fetch(config.publicChannelId);
        if (publicChannel) {
          publicChannel.send({
            content: `Annonce validée :\n**${pending.title}**\n${pending.link}`,
          });
        }
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        message.reply("Annonce validée et publiée dans le channel public.");
      } else {
        message.reply("Aucune annonce à valider ou channel public non défini.");
      }
    }
  },
};
