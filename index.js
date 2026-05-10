require("dotenv").config();

const {
Client,
GatewayIntentBits,
PermissionsBitField,
ChannelType,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
REST,
Routes,
SlashCommandBuilder
} = require("discord.js");

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
]
});

const filas = {
mobile1v1: []
};

client.once("ready", async () => {

console.log(`✅ ${client.user.tag} online`);

const commands = [

new SlashCommandBuilder()
.setName("org")
.setDescription("Criar organização"),

new SlashCommandBuilder()
.setName("limpar")
.setDescription("Limpar canal")

].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" })
.setToken(process.env.TOKEN);

await rest.put(
Routes.applicationCommands(client.user.id),
{ body: commands }
);

console.log("✅ Slash carregadas");

});

// ==========================================
// INTERACTIONS
// ==========================================

client.on("interactionCreate", async interaction => {


// ==========================================
// /ORG
// ==========================================

if (
interaction.isChatInputCommand() &&
interaction.commandName === "org"
) {

if (!interaction.member.permissions.has(
PermissionsBitField.Flags.Administrator
)) {
return interaction.reply({
content: "❌ Sem permissão",
ephemeral: true
});
}

await interaction.reply({
content: "⚙️ Criando organização...",
ephemeral: true
});

const guild = interaction.guild;

// ==========================================
// CARGOS
// ==========================================

await guild.roles.create({
name: "DONO",
color: "#000000"
});

await guild.roles.create({
name: "CEO",
color: "#00ff00"
});

await guild.roles.create({
name: "GERENTE",
color: "#ff0000"
});

await guild.roles.create({
name: "ADM",
color: "#0011ff"
});

await guild.roles.create({
name: "SUP",
color: "#8c00ff"
});

await guild.roles.create({
name: "SS",
color: "#00bbff"
});

await guild.roles.create({
name: "MEDIADOR",
color: "#ffaa00"
});

// ==========================================
// CATEGORIAS
// ==========================================

const mobile = await guild.channels.create({
name: "📱 MOBILE",
type: ChannelType.GuildCategory
});

const misto = await guild.channels.create({
name: "💻 MISTO",
type: ChannelType.GuildCategory
});

const emulador = await guild.channels.create({
name: "🖥 EMULADOR",
type: ChannelType.GuildCategory
});

const mediador = await guild.channels.create({
name: "🏦 MEDIADOR",
type: ChannelType.GuildCategory
});

// ==========================================
// CANAIS MOBILE
// ==========================================

const mobile1v1 = await guild.channels.create({
name: "🎰1x1-mobile",
type: ChannelType.GuildText,
parent: mobile.id
});

await guild.channels.create({
name: "🎰2x2-mobile",
type: ChannelType.GuildText,
parent: mobile.id
});

await guild.channels.create({
name: "🎰3x3-mobile",
type: ChannelType.GuildText,
parent: mobile.id
});

await guild.channels.create({
name: "🎰4x4-mobile",
type: ChannelType.GuildText,
parent: mobile.id
});

// ==========================================
// MISTO
// ==========================================

await guild.channels.create({
name: "💻2x2-misto",
type: ChannelType.GuildText,
parent: misto.id
});

await guild.channels.create({
name: "💻3x3-misto",
type: ChannelType.GuildText,
parent: misto.id
});

await guild.channels.create({
name: "💻4x4-misto",
type: ChannelType.GuildText,
parent: misto.id
});

// ==========================================
// EMULADOR
// ==========================================

await guild.channels.create({
name: "🖥1x1-emulador",
type: ChannelType.GuildText,
parent: emulador.id
});

await guild.channels.create({
name: "🖥2x2-emulador",
type: ChannelType.GuildText,
parent: emulador.id
});

await guild.channels.create({
name: "🖥3x3-emulador",
type: ChannelType.GuildText,
parent: emulador.id
});

// ==========================================
// MEDIADOR
// ==========================================

await guild.channels.create({
name: "👥fila-mediador",
type: ChannelType.GuildText,
parent: mediador.id
});

await guild.channels.create({
name: "💸configurar-pix",
type: ChannelType.GuildText,
parent: mediador.id
});

// ==========================================
// EMBED FILA
// ==========================================

const embed = new EmbedBuilder()
.setColor("#00ff88")
.setTitle("🎰 FILA 1X1 MOBILE")
.setDescription(`
🧊 Gelo infinito

💸 VALOR: R$5

👥 Jogadores:
0/2
`)
.setThumbnail(guild.iconURL());

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("entrar_1x1")
.setLabel("ENTRAR")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("sair_1x1")
.setLabel("SAIR")
.setStyle(ButtonStyle.Danger)

);

await mobile1v1.send({
embeds: [embed],
components: [row]
});

interaction.editReply({
content: "✅ Organização criada"
});

}

// ==========================================
// ENTRAR FILA
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "entrar_1x1"
) {

if (filas.mobile1v1.includes(interaction.user.id)) {
return interaction.reply({
content: "❌ Você já entrou",
ephemeral: true
});
}

filas.mobile1v1.push(interaction.user.id);

await interaction.reply({
content: "✅ Você entrou na fila",
ephemeral: true
});

// ==========================================
// COMPLETAR APOSTA
// ==========================================

if (filas.mobile1v1.length >= 2) {

const p1 = filas.mobile1v1[0];
const p2 = filas.mobile1v1[1];

filas.mobile1v1.shift();
filas.mobile1v1.shift();

const canal = await interaction.guild.channels.create({
name: `🎰aposta-${interaction.user.username}`,
type: ChannelType.GuildText
});

const embed = new EmbedBuilder()
.setColor("#00ff88")
.setTitle("🎰 APOSTA ENCONTRADA")
.setDescription(`
👤 <@${p1}>
👤 <@${p2}>

💸 VALOR: R$5
`);

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("confirmar")
.setLabel("Confirmar")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("cancelar")
.setLabel("Cancelar")
.setStyle(ButtonStyle.Danger)

);

await canal.send({
content: `<@${p1}> <@${p2}>`,
embeds: [embed],
components: [row]
});

}

}

// ==========================================
// CANCELAR
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "cancelar"
) {

await interaction.channel.delete();

}

// ==========================================
// CONFIRMAR
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "confirmar"
) {

await interaction.channel.bulkDelete(100);

const embed = new EmbedBuilder()
.setColor("#ffaa00")
.setTitle("🏦 MEDIADOR CHAMADO")
.setDescription(`
💸 Envie o pagamento
👨‍💼 Aguarde mediador
`);

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("fornecer")
.setLabel("Fornecer Sala")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("finalizar")
.setLabel("Finalizar")
.setStyle(ButtonStyle.Success)

);

await interaction.channel.send({
embeds: [embed],
components: [row]
});

}

// ==========================================
// FORNECER SALA
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "fornecer"
) {

const embed = new EmbedBuilder()
.setColor("#00ff88")
.setTitle("🎮 SALA FORNECIDA")
.setDescription(`
🆔 ID: 123456

🔐 SENHA: 9999
`);

await interaction.reply({
embeds: [embed]
});

}

// ==========================================
// FINALIZAR
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "finalizar"
) {

await interaction.reply({
content: "🏆 Aposta finalizada"
});

setTimeout(() => {
interaction.channel.delete();
}, 3000);

}

// ==========================================
// /LIMPAR
// ==========================================

if (
interaction.isChatInputCommand() &&
interaction.commandName === "limpar"
) {

const msgs = await interaction.channel.messages.fetch();

await interaction.channel.bulkDelete(msgs);

interaction.channel.send("✅ Canal limpo");

}

});

// ==========================================
// PERFIL
// ==========================================

client.on("messageCreate", async message => {

if (message.author.bot) return;

// ==========================================
// .P
// ==========================================

if (message.content.startsWith(".p")) {

const user =
message.mentions.users.first() ||
message.author;

const embed = new EmbedBuilder()
.setColor("#00ff88")
.setTitle(`📊 PERFIL ${user.username}`)
.setDescription(`
🏆 Vitórias: 0
❌ Derrotas: 0
📈 Winrate: 0%
`)
.setThumbnail(user.displayAvatarURL());

message.reply({
embeds: [embed]
});

}

// ==========================================
// SSMOB
// ==========================================

if (message.content === ".ssmob") {

const embed = new EmbedBuilder()
.setColor("#0099ff")
.setTitle("📱 SS MOBILE")
.setDescription(`
Solicitação enviada.
`);

message.reply({
embeds: [embed]
});

}

// ==========================================
// SSEMU
// ==========================================

if (message.content === ".ssemu") {

const embed = new EmbedBuilder()
.setColor("#0099ff")
.setTitle("💻 SS EMULADOR")
.setDescription(`
Solicitação enviada.
`);

message.reply({
embeds: [embed]
});

}

});

client.login(process.env.TOKEN);
