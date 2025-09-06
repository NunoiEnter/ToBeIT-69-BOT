import { Client, GuildMember, TextChannel } from "discord.js";
import { createWelcomeBanner } from "../utils/canvas.js";
import config from "../config.ts";

function getWelcomeChannel(member: GuildMember): TextChannel | null {
  // Try system channel
  if (
    member.guild.systemChannel &&
    member.guild.systemChannel.isTextBased() &&
    member.guild.systemChannel
      .permissionsFor(member.guild.members.me!)
      ?.has("SendMessages")
  ) {
    return member.guild.systemChannel as TextChannel;
  }

  // Fallback to first available text channel
  const channel = member.guild.channels.cache.find(
    (c) =>
      c.isTextBased() &&
      c.permissionsFor(member.guild.members.me!)?.has("SendMessages"),
  );

  return (channel as TextChannel) || null;
}

export function setupGuildMemberAdd(client: Client) {
  client.on("guildMemberAdd", async (member: GuildMember) => {
    try {
      const channel = getWelcomeChannel(member);
      if (!channel)
        return console.warn(
          `No accessible channel to welcome ${member.user.tag}`,
        );

      // THIS FUNCTION IS WAITING FOR AUTO TO BE MAKING CHANGE.
      const attachment = await createWelcomeBanner(
        member.user.username, // name of user 
        member.user.displayAvatarURL({ extension: "png" }), // user profile (dont change)
        "niga welcome", // welcome
        "🌟", // top title
        member.guild.name, // bottom title
        './assets/bg.png', // PNG background (dont change)
      );

      await channel.send({
        content: `🎉 ยินดีต้อนรับ <@${member.id}> สู่โลกแห่ง....!`,
        files: [attachment],
      });
    } catch (err) {
      console.error("Error sending welcome message:", err);
    }
  });
}
