import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("ยืนยันตัวตน");

export async function execute(interaction: ChatInputCommandInteraction) {
    const discord_id = interaction.user.id;
    const member = await interaction.guild?.members.fetch(discord_id);

    await interaction.deferReply({ ephemeral: true });

    // CALL DATABASE HERE USING ORM
    
    
}