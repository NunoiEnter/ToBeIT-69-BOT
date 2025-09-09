import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Role } from 'discord.js';
import db from '../db/db';
import { getUserByDiscordId } from '../api/get-discord';
export const data = new SlashCommandBuilder()
    .setName("verify")
    .setDescription("ยืนยันตัวตน");

export async function execute(interaction: ChatInputCommandInteraction) {
    const discord_id = interaction.user.id;
    const member = await interaction.guild?.members.fetch(discord_id);

    await interaction.deferReply({ ephemeral: false });

    if (member?.roles.cache.has('1415036639159255100')) {
        await interaction.editReply({ content: "คุณได้ยืนยันตัวตนไปแล้ว" });
        return;
    }

    const user = await getUserByDiscordId(discord_id);
    if (!user) {
        await interaction.editReply({ content: "คุณไม่มีสิทธิ์ใช้งานคำสั่งนี้" });
        return;
    }

    const role = await interaction.guild?.roles.fetch('1415036639159255100');
    if (role && member) {
        try {
            await member.roles.add(role);
            await member.setNickname(`น้อง ${user.firstname} ${user.grade} ${user.region}`);
        } catch (error) {
            console.error('Permission error:', error);
            await interaction.editReply({ content: "คุณไม่มีสิทธิ์ใช้งานคำสั่งนี้" });
            return;
        }
    }

    const successEmbed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ ยืนยันตัวตนสำเร็จแล้ว')
        .setDescription([
            `> 💳 **น้อง :** ${user.nickname}`,
            `> 👤 **ชื่อในระบบ :** ${user.firstname}`,
            `> 🎓 **ระดับชั้น :** ${user.grade}`,
            `> 🏷️ **ภาค :** ${user.region}`,
            `> 🎺 **ได้รับยศ :** <@&1415036639159255100>`
        ].join('\n'))
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({
            text: '🔐 verify system',
            iconURL: 'https://instagram.fbkk28-1.fna.fbcdn.net/v/t51.2885-19/331720934_1350229852439597_1638687181144415381_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby45NjAuYzIifQ&_nc_ht=instagram.fbkk28-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2QGCtBfA6moWUfJukwn9dSMfC9X1gdnNz6coCqZ9mBRfY63NGVJ6srvMg_Usb55fcRDSqdUH5nAGrpmKaM4irNq8&_nc_ohc=jhbOpMShsxYQ7kNvwFG4l80&_nc_gid=5yNsD2s7unxF0ALCNRrXgQ&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AfY1t6WUSsYBj-gVA4Hf6tww7eILvqThicNf6NXSQTchCA&oe=68C642F5&_nc_sid=7a9f4b'
        });

    await interaction.editReply({ embeds: [successEmbed] });
}