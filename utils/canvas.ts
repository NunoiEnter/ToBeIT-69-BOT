import { createCanvas, loadImage } from "canvas";
import { AttachmentBuilder } from "discord.js";

/**
 * Creates a welcome banner with:
 * - Centered avatar
 * - Centered text below avatar
 * - Emblem text above
 * - Custom PNG background
 *
 * @param username - Name of the new member
 * @param avatarURL - URL of the user's avatar
 * @param welcomeText - Main welcome message
 * @param emblemText - Small emblem/title above the avatar
 * @param serverName - Optional server name below welcome text
 * @param backgroundURL - URL or local path to PNG background
 */
export async function createWelcomeBanner(
  username: string,
  avatarURL: string,
  welcomeText: string,
  emblemText: string,
  serverName?: string,
  backgroundURL?: string, // optional PNG background
) {
  const width = 800;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ===== Background =====
  if (backgroundURL) {
    const bg = await loadImage(backgroundURL);
    ctx.drawImage(bg, 0, 0, width, height);
  } else {
    // fallback to solid color
    ctx.fillStyle = "#2c2f33";
    ctx.fillRect(0, 0, width, height);
  }

  // ===== Emblem text (top) =====
  ctx.fillStyle = "#FFD700"; // color
  ctx.font = "bold 30px Sans";
  ctx.textAlign = "center";
  ctx.fillText(emblemText, width / 2, 60);

  // ===== Avatar (centered) =====
  const avatar = await loadImage(avatarURL);
  const avatarSize = 200; // change avatar size here
  const avatarX = width / 2 - avatarSize / 2; // horizontal center
  const avatarY = height / 2 - avatarSize / 2 - 20; // vertical position

  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  ctx.restore();

  // Avatar border
  ctx.strokeStyle = "#ffffff"; // border color
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(width / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  // ===== Welcome text (below avatar) =====
  ctx.fillStyle = "#ffffff";
  let fontSize = 40; // starting font size
  ctx.font = `bold ${fontSize}px Sans`;

  while (ctx.measureText(`${welcomeText}, ${username}!`).width > width - 100) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px Sans`;
  }

  ctx.fillText(
    `${welcomeText}, ${username}!`,
    width / 2,
    avatarY + avatarSize + 50,
  );

  // ===== Server name (optional, below welcome text) =====
  if (serverName) {
    ctx.fillStyle = "#eeeeee";
    ctx.font = "28px Sans";
    ctx.fillText(`${serverName}`, width / 2, avatarY + avatarSize + 90);
  }

  return new AttachmentBuilder(canvas.toBuffer("image/png"), {
    name: "welcome.png",
  });
}
