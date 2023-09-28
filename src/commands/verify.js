const { SlashCommandBuilder } = require('discord.js');
const { userModel } = require('../schema.js')

const GUEST_ROLE_ID = '1156849097513381969';
const VERIFIED_ROLE_ID = '1156849206254903296'
const VERIFY_LOG_CHANNELID = '1156850191543046165'

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('verifies a user'),
    async execute(interaction) {
        try {

            if (!interaction.member.roles.cache.has(GUEST_ROLE_ID) && interaction.member.roles.cache.has(VERIFIED_ROLE_ID)) {
                return interaction.reply({content:"You are already verified",ephemeral:true })
            } 

            let userData = await userModel.findOne({ discordId: interaction.member.user.id })
            if(!userData){
                return   interaction.reply({ content: `Please register before verifying https://devjsx/register`,ephemeral:true });
            }
            const verified_role = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID)
            const guest_role = interaction.guild.roles.cache.get(GUEST_ROLE_ID)

            await interaction.member.roles.add(verified_role)
            await interaction.member.roles.remove(guest_role)
            await interaction.member.setNickname(userData.fullname);
            
            let log_channel = await interaction.guild.channels.cache.get(VERIFY_LOG_CHANNELID)
            log_channel.send(`Verification Success for <@${interaction.member.user.id}> `)
            await interaction.reply({content:'Verified',ephemeral:true });
        } catch (err) {
            console.log(err)
        }
    }
};

