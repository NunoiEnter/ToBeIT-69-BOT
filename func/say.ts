import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("say")
  .setDescription("พูดคำว่า")
  .addChannelOption(option =>
    option.setName('channel')
        .setDescription('ช่องที่จะพูด')
        .setRequired(true)
    )
  .addStringOption(option =>
    option.setName('message')
        .setDescription('คำว่า')
        .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel', true)
    const message = interaction.options.getString('message', true)
    const user = interaction.user
    const embed = new EmbedBuilder()
        .setColor(0x0099ff) 
        .setTitle("⭐️ Say by " + user.username)
        .setDescription(
            message,
        )
        .setFooter({ text: user.username })
        .setThumbnail((interaction.client.user?.displayAvatarURL() || "") || ""); // <-- small image top-right

    await (channel as TextChannel).send({ embeds: [embed] });
    await interaction.reply({ content: "พูดไปแล้วจ้า", ephemeral: true });
}