const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token,GUEST_ROLE_ID} = require('../config.json');
const { connectDb } = require('./database/database');


const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

// Storing commands in an array for suggestions in guild 
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    console.log(file)
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command); // Storing command in event handler 
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


// Slash Command Event Receiever 
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (error) {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on('guildMemberAdd',async(member) =>{
    const guest_role =  member.guild.roles.cache.get(GUEST_ROLE_ID)
    await member.roles.add(guest_role)
})

client.once(Events.ClientReady, async c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    await connectDb()
    await client.guilds.cache.get('983252105244573736').commands.set(commands)
});


client.login(token);

