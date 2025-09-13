import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
  Role,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("say")
  .setDescription("พูดคำว่า")
  .addChannelOption((option) =>
    option.setName("channel").setDescription("ช่องที่จะพูด").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("title").setDescription("หัวข้อ").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("message").setDescription("คำว่า").setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // Check user role if not staff return
  const user = interaction.user;
  const member = interaction.guild?.members.cache.get(user.id);
  const staffRole = interaction.guild?.roles.cache.find(role => role.name.toLowerCase() === "staff") as Role;
  if (!staffRole || !member?.roles.cache.has(staffRole.id)) {
    await interaction.reply({
      content: "คุณไม่มีสิทธิ์ใช้งานคำสั่งนี้",
      ephemeral: true,
    });
    return;
  }

  const channel = interaction.options.getChannel("channel", true);
  const message = interaction.options.getString("message", true);
  const title = interaction.options.getString("title") || "TobeIT'69";
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(title)
    .setDescription(message)
    .setFooter({ text: "TobeIT'69" })
    .setThumbnail(interaction.client.user?.displayAvatarURL() || "" || ""); // <-- small image top-right

  await (channel as TextChannel).send({ embeds: [embed] });
  await interaction.reply({ content: "พูดไปแล้วจ้า", ephemeral: true });
}
