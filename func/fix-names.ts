import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { getUserByDiscordId } from '../api/get-discord';
import type { PersonalDataResponse } from '../api/interface';
export const data = new SlashCommandBuilder()
    .setName("fix-names")
    .setDescription("แก้ไขชื่อ")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);
    
export async function execute(interaction: ChatInputCommandInteraction) {

    await interaction.deferReply({ ephemeral: false });

    // First filter all member that name is not starts with 'น้อง' and is Online Camper role
    const onlineCampers = await interaction.guild?.members.fetch({
        limit: 1000
    });

    const membersToFix = onlineCampers?.filter((member) => !member.displayName.startsWith('น้อง') && member.roles.cache.has('1416465814692823220'));
    if (!membersToFix) {
        await interaction.editReply({ content: "ไม่พบสมาชิกที่ต้องแก้ไข" });
        return;
    }
    
    await Promise.all(
        Array.from(membersToFix).map(async ([_, member]) => {
            // Get the user from the database
            const user = await getUserByDiscordId(member.id) as PersonalDataResponse;
            if (!user) {
                await interaction.editReply({ content: "ไม่พบสมาชิกในระบบ" });
            }
            // Fix the name
            let regionDisplay = user.region;
            if (user.region === 'ภาคตะวันออกเฉียงเหนือ') {
                regionDisplay = 'ภาคอีสาน';
            } else if (user.region === 'กรุงเทพและปริมณฑล') {
                regionDisplay = 'กรุงเทพ';
            }
            // console.log(`น้อง ${user.firstName} ${user.grade} ${regionDisplay}`);
            await member.setNickname(`น้อง ${user.firstName} ${user.grade} ${regionDisplay}`);
        })
    );

    const editedNames = [];
    for (const [_, member] of membersToFix) {
        editedNames.push(member.displayName);
    }

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ แก้ไขชื่อสำเร็จแล้ว')
        .setDescription(`แก้ไขชื่อของสมาชิก ${editedNames.length} คน:\n\n${editedNames.map(name => `• ${name}`).join('\n')}`)
        .setTimestamp()
        .setFooter({
            text: '🔧 fix names system'
        });

    await interaction.editReply({ embeds: [embed] });
}
