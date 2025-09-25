const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "..", "data", "config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setpublicchannel")
    .setDescription("Définit le channel public d'annonce")
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Le channel où les annonces seront postées")
        .setRequired(true)),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(process.env.ALLOWED_ROLE_ID)) {
      return interaction.reply({ content: "Tu n'as pas la permission d'utiliser cette commande.", flags: MessageFlags.Ephemeral});
    }
    const channel = interaction.options.getChannel("channel");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    config.publicChannelId = channel.id;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return interaction.reply({ content: `Channel public défini sur ${channel}`});
  },
};
