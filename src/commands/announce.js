const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('sends and announcement ')
        .addStringOption(message =>
            message.setName('message')
                .setRequired(true)
                .setDescription('Type the message that you want to  announce')
        )
        .addChannelOption(channel =>
            channel.setName('channel')
                .setRequired(true)
                .setDescription('Select the channel for announcement')
        )
        .addStringOption(string =>
            string.setName('title')
                .setRequired(true)
                .setDescription('Provide the title for your embed')
        )
        .addRoleOption(role =>
            role.setName('role')
                .setDescription('Provide the roles that you  want to ping')
        )
        .addStringOption(string =>
            string.setName('img')
                .setDescription('Provide the image url')
        ),

    async execute(interaction) {

        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                return interaction.reply(`You Dont Have Permissions To Announce Message`);
            }

            const message = interaction.options.getString('message');
            const title = interaction.options.getString('title');
            const imageUrl = interaction.options.getString('img');
            const channel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role')

            
            // Split the message into words and add line breaks after \n pattern
            const words = message.split(/\s+/); // Split by whitespace
            const formattedMessage = words.map(word => {
                if (word.includes('\\n')) {
                    return word.replace('\\n', '\n\n');
                }
                return word;
            }).join(' ');

            if (imageUrl) {
                if (!imageUrl.startsWith("https://media.discordapp.net/attachments/")) {
                    let invalidlinkembedd = new EmbedBuilder()
                    invalidlinkembedd
                        .setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
                        .setDescription(
                            `Image url starting with \`https://cdn.discordapp.com/attachments/\` are only accepted 
                            '\n' Simply sent your image  to any discord channel then copy the link and paste it here `
                        );
                    return interaction.reply({ embeds: [invalidlinkembedd], ephemeral: true });
                }

            }
            const sayembed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(title)
                .setDescription(formattedMessage)
                .setTimestamp()
                .setImage(imageUrl)
                .setFooter({ text: 'Announced By Dev.jsx' });

            channel.send({content:`${role ?? ''}`, embeds: [sayembed] }).then((msg) => {
                return interaction.reply({
                    embeds: [new EmbedBuilder().setColor(0x0099FF).setDescription(`✅ Your Announcement is now live in ${channel}`)],
                    ephemeral: true,
                });
            });

        } catch (err) {
            console.log(err)
        }
    }
};


