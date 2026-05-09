// ==========================================
// BOT ORG COMPLETO - INDEX.JS
// COLOQUE TUDO ISSO NO INDEX.JS
// ==========================================

require("dotenv").config();

const {
Client,
GatewayIntentBits,
Partials,
PermissionsBitField,
ChannelType,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle,
SlashCommandBuilder,
REST,
Routes,
ModalBuilder,
TextInputBuilder,
TextInputStyle,
InteractionType
} = require("discord.js");

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
],
partials: [Partials.Channel]
});

const filas = {
mobile1v1: [],
};

const mediadores = [];

const pixMediadores = new Map();

client.once("ready", async () => {

console.log(`✅ ${client.user.tag} ONLINE`);

const commands = [

new SlashCommandBuilder()
.setName("org")
.setDescription("Criar organização"),

new SlashCommandBuilder()
.setName("configurar")
.setDescription("Configurar sistema"),

new SlashCommandBuilder()
.setName("limpar")
.setDescription("Limpar mensagens"),

].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" })
.setToken(process.env.TOKEN);

try {

await rest.put(
Routes.applicationCommands(client.user.id),
{ body: commands }
);

console.log("✅ Slash Commands carregados");

} catch (err) {
console.log(err);
}

});

// ==========================================
// COMANDOS
// ==========================================

client.on("interactionCreate", async (interaction) => {

// ==========================================
// /ORG
// ==========================================

if (
interaction.isChatInputCommand() &&
interaction.commandName === "org"
) {

if (!interaction.member.permissions.has(
PermissionsBitField.Flags.Administrator
)) return interaction.reply({
content: "❌ Sem permissão",
ephemeral: true
});

await interaction.reply({
content: "⚙️ Criando organização...",
ephemeral: true
});

const guild = interaction.guild;

// ==========================================
// CARGOS
// ==========================================

const cargos = {};

cargos.dono = await guild.roles.create({
name: "DONO",
color: "#000000"
});

cargos.sub = await guild.roles.create({
name: "SUB DONO",
color: "#2f3136"
});

cargos.ceo = await guild.roles.create({
name: "CEO",
color: "#00ff00"
});

cargos.gerente = await guild.roles.create({
name: "GERENTE",
color: "#ff0000"
});

cargos.admin = await guild.roles.create({
name: "ADM",
color: "#0011ff"
});

cargos.sup = await guild.roles.create({
name: "SUP",
color: "#7a00ff"
});

cargos.ss = await guild.roles.create({
name: "SS",
color: "#00c3ff"
});

cargos.mediador = await guild.roles.create({
name: "MEDIADOR",
color: "#ffaa00"
});

// ==========================================
// CATEGORIAS
// ==========================================

const mobile = await guild.channels.create({
name: "📱 mobile",
type: ChannelType.GuildCategory
});

const misto = await guild.channels.create({
name: "💻 misto",
type: ChannelType.GuildCategory
});

const emulador = await guild.channels.create({
name: "🖥 emulador",
type: ChannelType.GuildCategory
});

const mediador = await guild.channels.create({
name: "🏦 mediador",
type: ChannelType.GuildCategory
});

// ==========================================
// FILAS MOBILE
// ==========================================

const mobile1 = await guild.channels.create({
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
// FILAS MISTO
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
// FILAS EMULADOR
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
// CANAIS MEDIADOR
// ==========================================

const filaMediador = await guild.channels.create({
name: "👥fila-mediador",
type: ChannelType.GuildText,
parent: mediador.id
});

const pixCanal = await guild.channels.create({
name: "💸configurar-pix",
type: ChannelType.GuildText,
parent: mediador.id
});

// ==========================================
// PAINEL FILA MEDIADOR
// ==========================================

const embedM = new EmbedBuilder()
.setTitle("👥 FILA MEDIADOR")
.setDescription("Entre ou saia da fila.")
.setColor("#2f3136");

const rowM = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("entrar_mediador")
.setLabel("Entrar")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("sair_mediador")
.setLabel("Sair")
.setStyle(ButtonStyle.Danger)

);

await filaMediador.send({
embeds: [embedM],
components: [rowM]
});

// ==========================================
// PAINEL PIX
// ==========================================

const embedPix = new EmbedBuilder()
.setTitle("💸 CONFIGURAR PIX")
.setDescription("Configure seu pagamento.")
.setColor("#00ff88");

const rowPix = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("config_pix")
.setLabel("Configurar Pagamento")
.setStyle(ButtonStyle.Primary)

);

await pixCanal.send({
embeds: [embedPix],
components: [rowPix]
});

// ==========================================
// PAINEL FILA
// ==========================================

const embedFila = new EmbedBuilder()
.setTitle("🎰 1X1 MOBILE")
.setDescription(`
🧊 Gelo infinito
💸 Valor: R$5
👥 Jogadores: 0/2
`)
.setColor("#00ff88")
.setThumbnail(guild.iconURL());

const rowFila = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("entrar_1x1")
.setLabel("Entrar")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("sair_1x1")
.setLabel("Sair")
.setStyle(ButtonStyle.Danger)

);

await mobile1.send({
embeds: [embedFila],
components: [rowFila]
});

interaction.editReply({
content: "✅ Organização criada."
});

}

// ==========================================
// /LIMPAR
// ==========================================

if (
interaction.isChatInputCommand() &&
interaction.commandName === "limpar"
) {

const msgs = await interaction.channel.messages.fetch();

interaction.channel.bulkDelete(msgs);

interaction.channel.send("✅ Canal limpo");

}

// ==========================================
// ENTRAR FILA
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "entrar_1x1"
) {

if (filas.mobile1v1.includes(interaction.user.id))
return interaction.reply({
content: "❌ Você já está na fila.",
ephemeral: true
});

filas.mobile1v1.push(interaction.user.id);

await interaction.reply({
content: "✅ Você entrou na fila.",
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
name: `🎰-${interaction.user.username}`,
type: ChannelType.GuildText
});

const embed = new EmbedBuilder()
.setTitle("🎰 APOSTA ENCONTRADA")
.setDescription(`
👤 <@${p1}>
👤 <@${p2}>

💸 Valor: R$5
`)
.setColor("#00ff88");

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId(`confirmar_${p1}_${p2}`)
.setLabel("Confirmar")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("cancelar_aposta")
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
interaction.customId === "cancelar_aposta"
) {

await interaction.channel.delete();

}

// ==========================================
// CONFIRMAR
// ==========================================

if (
interaction.isButton() &&
interaction.customId.startsWith("confirmar_")
) {

await interaction.channel.bulkDelete(100);

const mediadorID = mediadores[0];

const embed = new EmbedBuilder()
.setTitle("🏦 MEDIADOR ENCONTRADO")
.setDescription(`
👨‍💼 Mediador: <@${mediadorID || interaction.user.id}>
`)
.setColor("#ffaa00");

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId("fornecer_sala")
.setLabel("Fornecer Sala")
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId("finalizar_aposta")
.setLabel("Finalizar")
.setStyle(ButtonStyle.Success)

);

await interaction.channel.send({
embeds: [embed],
components: [row]
});

}

// ==========================================
// FILA MEDIADOR
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "entrar_mediador"
) {

if (!interaction.member.roles.cache.some(
r => r.name === "MEDIADOR"
)) return interaction.reply({
content: "❌ Você não é mediador.",
ephemeral: true
});

if (!mediadores.includes(interaction.user.id)) {
mediadores.push(interaction.user.id);
}

interaction.reply({
content: "✅ Você entrou na fila mediador.",
ephemeral: true
});

}

// ==========================================
// CONFIGURAR PIX
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "config_pix"
) {

const modal = new ModalBuilder()
.setCustomId("modal_pix")
.setTitle("Configurar PIX");

const chave = new TextInputBuilder()
.setCustomId("chave")
.setLabel("Sua chave PIX")
.setStyle(TextInputStyle.Short);

const nome = new TextInputBuilder()
.setCustomId("nome")
.setLabel("Seu nome")
.setStyle(TextInputStyle.Short);

const cidade = new TextInputBuilder()
.setCustomId("cidade")
.setLabel("Sua cidade")
.setStyle(TextInputStyle.Short);

modal.addComponents(
new ActionRowBuilder().addComponents(chave),
new ActionRowBuilder().addComponents(nome),
new ActionRowBuilder().addComponents(cidade)
);

await interaction.showModal(modal);

}

// ==========================================
// MODAL PIX
// ==========================================

if (
interaction.type === InteractionType.ModalSubmit &&
interaction.customId === "modal_pix"
) {

const chave = interaction.fields.getTextInputValue("chave");
const nome = interaction.fields.getTextInputValue("nome");
const cidade = interaction.fields.getTextInputValue("cidade");

pixMediadores.set(interaction.user.id, {
chave,
nome,
cidade
});

interaction.reply({
content: "✅ PIX configurado.",
ephemeral: true
});

}

// ==========================================
// FORNECER SALA
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "fornecer_sala"
) {

const modal = new ModalBuilder()
.setCustomId("modal_sala")
.setTitle("Fornecer Sala");

const id = new TextInputBuilder()
.setCustomId("id")
.setLabel("ID Sala")
.setStyle(TextInputStyle.Short);

const senha = new TextInputBuilder()
.setCustomId("senha")
.setLabel("Senha")
.setStyle(TextInputStyle.Short);

modal.addComponents(
new ActionRowBuilder().addComponents(id),
new ActionRowBuilder().addComponents(senha)
);

interaction.showModal(modal);

}

// ==========================================
// MODAL SALA
// ==========================================

if (
interaction.type === InteractionType.ModalSubmit &&
interaction.customId === "modal_sala"
) {

const id = interaction.fields.getTextInputValue("id");
const senha = interaction.fields.getTextInputValue("senha");

const embed = new EmbedBuilder()
.setTitle("🎮 SALA FORNECIDA")
.setDescription(`
🆔 ID: ${id}
🔐 Senha: ${senha}
`)
.setColor("#00ff88");

await interaction.reply({
embeds: [embed]
});

}

// ==========================================
// FINALIZAR
// ==========================================

if (
interaction.isButton() &&
interaction.customId === "finalizar_aposta"
) {

await interaction.channel.send("🏆 Aposta finalizada.");

setTimeout(() => {
interaction.channel.delete();
}, 5000);

}

});

// ==========================================
// PERFIL
// ==========================================

client.on("messageCreate", async (message) => {

if (message.author.bot) return;

if (message.content.startsWith(".p")) {

const user =
message.mentions.users.first() ||
message.author;

const embed = new EmbedBuilder()
.setTitle(`📊 Perfil ${user.username}`)
.setDescription(`
🏆 Vitórias: 0
❌ Derrotas: 0
📈 Winrate: 0%
`)
.setThumbnail(user.displayAvatarURL())
.setColor("#00ff88");

message.reply({
embeds: [embed]
});

}

// ==========================================
// SS MOBILE
// ==========================================

if (message.content === ".ssmob") {

message.channel.send("📱 SS MOBILE SOLICITADA");

}

// ==========================================
// SS EMULADOR
// ==========================================

if (message.content === ".ssemu") {

message.channel.send("💻 SS EMULADOR SOLICITADA");

}

});

client.login(process.env.TOKEN);
