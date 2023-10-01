const { Client } = require('discord.js');

const client = new Client();
const prefix = '!'; // Set your desired bot prefix here

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  if (message.content.startsWith(prefix)) {
    const [command, ...args] = message.content.slice(prefix.length).split(' ');
    
    if (command === 'ticket') {
      const category = message.guild.channels.cache.find(c => c.name === 'Tickets' && c.type === 'GUILD_CATEGORY');
      if (!category) {
        try {
          const createdCategory = await message.guild.channels.create('Tickets', { type: 'GUILD_CATEGORY' });
          console.log(`Created category ${createdCategory.name}`);
        } catch (err) {
          console.error('Error creating category:', err);
          return;
        }
      }
      
      const channelName = `ticket-${message.author.id}`;
      const existingChannel = message.guild.channels.cache.find(c => c.name === channelName && c.type === 'GUILD_TEXT');
      if (existingChannel) {
        message.reply('You already have an active ticket.');
        return;
      }
      
      try {
        const createdChannel = await message.guild.channels.create(channelName, { type: 'GUILD_TEXT', parent: category.id });
        console.log(`Created channel ${createdChannel.name}`);
        await createdChannel.permissionOverwrites.create(message.author, { VIEW_CHANNEL: true });
        await createdChannel.permissionOverwrites.create(message.guild.roles.everyone, { VIEW_CHANNEL: false });
        message.reply(`Your ticket has been created! ${createdChannel}`);
      } catch (err) {
        console.error('Error creating channel:', err);
        return;
      }
    }
  }
});

client.login('BOT_TOKEN')
