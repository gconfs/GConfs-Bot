const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "..", "data", "config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addfeed")
    .setDescription("Ajoute un flux RSS à surveiller")
    .addStringOption(option =>
      option.setName("url")
        .setDescription("URL du flux RSS")
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString("url");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    if (config.rssFeeds.includes(url)) {
      return interaction.reply({ content: "Ce flux RSS est déjà ajouté."});
    }

    config.rssFeeds.push(url);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return interaction.reply({ content: `Flux RSS ajouté : ${url}`});
  },
};
