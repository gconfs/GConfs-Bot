const { Events } = require("discord.js");
const { startMonitoring } = require("../utils/rssMonitor"); 

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    startMonitoring(client);  
  },
};
