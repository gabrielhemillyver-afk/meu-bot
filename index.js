require('dotenv').config()

const {
Client,
GatewayIntentBits,
PermissionsBitField,
ChannelType,
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require('discord.js')

const QRCode = require('qrcode')

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.GuildMembers
]
})

const filas = {}
const apostas = {}
const mediadores = []
const perfis = {}

client.once('ready', () => {
console.log('BOT ONLINE')
})

// =========================================
// COMANDOS
// =========================================

client.on('messageCreate', async message => {

if (message.author.bot) return

// =========================================
// !ORG
// =========================================

if (message.content === '!org') {

if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
return
}

const cargos = [
'DONO',
'SUB DONO',
'CEO',
'GERENTE',
'DIRETOR',
'DIR SS',
'ADM',
'SUP',
'SS MOBILE',
'SS EMULADOR',
'MEDIADOR'
]

for (const cargo of cargos) {

if (!message.guild.roles.cache.find(r => r.name === cargo)) {

await message.guild.roles.create({
name: cargo,
color: 'Random'
})
}
}

// =========================================
// CATEGORIAS
// =========================================

const catFila = await message.guild.channels.create({
name: '🎮 FILAS',
type: ChannelType.GuildCategory
})

const catAposta = await message.guild.channels.create({
name: '💸 APOSTAS',
type: ChannelType.GuildCategory
})

const catMedia = await message.guild.channels.create({
name: '🎧 MEDIAÇÃO',
type: ChannelType.GuildCategory
})

const catSS = await message.guild.channels.create({
name: '🛡️ SS',
type: ChannelType.GuildCategory
})

// =========================================
// CANAIS FILA
// =========================================

const canais = [

'1x1-mobile',
'2x2-mobile',
'3x3-mobile',
'4x4-mobile',

'1x1-misto',
'2x2-misto',
'3x3-misto',
'4x4-misto',

'1x1-emulador',
'2x2-emulador',
'3x3-emulador',
'4x4-emulador'
]

for (const nome of canais) {

const canal = await message.guild.channels.create({
name: nome,
type: ChannelType.GuildText,
parent: catFila.id
})

const embed = new EmbedBuilder()
.setTitle('🎮 FILA DE APOSTA')
.setDescription(`
Modo:
${nome}

Clique abaixo para entrar na fila.
`)
.setThumbnail(message.guild.iconURL())
.setColor('#00ff88')

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId(`fila_${nome}`)
.setLabel('Entrar na fila')
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId(`sair_${nome}`)
.setLabel('Sair da fila')
.setStyle(ButtonStyle.Danger)
)

await canal.send({
embeds: [embed],
components: [row]
})
}

// =========================================
// CANAL MEDIADOR
// =========================================

await message.guild.channels.create({
name: 'fila-mediadores',
type: ChannelType.GuildText,
parent: catMedia.id
})

// =========================================
// CANAL SS
// =========================================

await message.guild.channels.create({
name: 'solicitacao-ss',
type: ChannelType.GuildText,
parent: catSS.id
})

message.reply('ORG CRIADA.')
}

// =========================================
// .P
// =========================================

if (message.content.startsWith('.p')) {

const user = message.mentions.users.first() || message.author

if (!perfis[user.id]) {
perfis[user.id] = {
wins: 0,
loses: 0
}
}

const perfil = perfis[user.id]

const embed = new EmbedBuilder()
.setTitle(`PERFIL DE ${user.username}`)
.setDescription(`
🏆 Vitórias: ${perfil.wins}

❌ Derrotas: ${perfil.loses}
`)
.setThumbnail(user.displayAvatarURL())
.setColor('#00ff88')

message.reply({
embeds: [embed]
})
}

// =========================================
// .SSMOB
// =========================================

if (message.content === '.ssmob') {

const canal = message.guild.channels.cache.find(
c => c.name === 'solicitacao-ss'
)

const embed = new EmbedBuilder()
.setTitle('🛡️ SOLICITAÇÃO SS MOBILE')
.setDescription(`
Solicitado por:
${message.author}
`)
.setColor('#00ff88')

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId(`aceitar_ss_${message.author.id}`)
.setLabel('Aceitar')
.setStyle(ButtonStyle.Success)
)

canal.send({
embeds: [embed],
components: [row]
})

message.reply('SS solicitada.')
}

// =========================================
// .SSEMU
// =========================================

if (message.content === '.ssemu') {

const canal = message.guild.channels.cache.find(
c => c.name === 'solicitacao-ss'
)

const embed = new EmbedBuilder()
.setTitle('🛡️ SOLICITAÇÃO SS EMULADOR')
.setDescription(`
Solicitado por:
${message.author}
`)
.setColor('#00ff88')

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId(`aceitar_ss_${message.author.id}`)
.setLabel('Aceitar')
.setStyle(ButtonStyle.Success)
)

canal.send({
embeds: [embed],
components: [row]
})

message.reply('SS solicitada.')
}

// =========================================
// /LIMPAR
// =========================================

if (message.content === '/limpar') {

if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
return
}

await message.channel.bulkDelete(100)

message.channel.send('Canal limpo.')
}
})

// =========================================
// BOTÕES
// =========================================

client.on('interactionCreate', async interaction => {

if (!interaction.isButton()) return

// =========================================
// FILA
// =========================================

if (interaction.customId.startsWith('fila_')) {

const fila = interaction.customId

if (!filas[fila]) {
filas[fila] = []
}

if (filas[fila].includes(interaction.user.id)) {

return interaction.reply({
content: 'Você já entrou.',
ephemeral: true
})
}

filas[fila].push(interaction.user.id)

await interaction.reply({
content: 'Entrou na fila.',
ephemeral: true
})

// =========================================
// MATCH
// =========================================

if (filas[fila].length >= 2) {

const jogadores = filas[fila].splice(0, 2)

const canal = await interaction.guild.channels.create({
name: `aposta-${Date.now()}`,
type: ChannelType.GuildText,

parent: interaction.guild.channels.cache.find(
c => c.name === '💸 APOSTAS'
)?.id,

permissionOverwrites: [
{
id: interaction.guild.id,
deny: [PermissionsBitField.Flags.ViewChannel]
},
...jogadores.map(id => ({
id,
allow: [PermissionsBitField.Flags.ViewChannel]
}))
]
})

apostas[canal.id] = jogadores

const embed = new EmbedBuilder()
.setTitle('💸 CONFIRMAÇÃO')
.setDescription(`
${jogadores.map(id => `<@${id}>`).join('\n')}

Confirmem abaixo.
`)
.setThumbnail(interaction.guild.iconURL())
.setColor('#00ff88')

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId('confirmar')
.setLabel('Confirmar')
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId('cancelar')
.setLabel('Cancelar')
.setStyle(ButtonStyle.Danger)
)

canal.send({
content: jogadores.map(id => `<@${id}>`).join(' '),
embeds: [embed],
components: [row]
})
}
}

// =========================================
// SAIR FILA
// =========================================

if (interaction.customId.startsWith('sair_')) {

const fila = interaction.customId.replace('sair_', 'fila_')

if (!filas[fila]) return

filas[fila] = filas[fila].filter(
id => id !== interaction.user.id
)

interaction.reply({
content: 'Saiu da fila.',
ephemeral: true
})
}

// =========================================
// CANCELAR
// =========================================

if (interaction.customId === 'cancelar') {

interaction.reply('Aposta cancelada.')

setTimeout(() => {
interaction.channel.delete()
}, 3000)
}

// =========================================
// CONFIRMAR
// =========================================

if (interaction.customId === 'confirmar') {

await interaction.channel.bulkDelete(100)

const embed = new EmbedBuilder()
.setTitle('🎮 APOSTA INICIADA')
.setDescription(`
Aguardando mediador.
`)
.setThumbnail(interaction.guild.iconURL())
.setColor('#00ff88')

const row = new ActionRowBuilder()
.addComponents(

new ButtonBuilder()
.setCustomId('pix')
.setLabel('Enviar PIX')
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId('sala')
.setLabel('Fornecer Sala')
.setStyle(ButtonStyle.Primary),

new ButtonBuilder()
.setCustomId('finalizar')
.setLabel('Finalizar')
.setStyle(ButtonStyle.Danger)
)

interaction.channel.send({
embeds: [embed],
components: [row]
})

interaction.reply({
content: 'Aposta iniciada.',
ephemeral: true
})
}

// =========================================
// PIX
// =========================================

if (interaction.customId === 'pix') {

const chave = '11999999999'

const qr = await QRCode.toDataURL(chave)

const embed = new EmbedBuilder()
.setTitle('💸 PAGAMENTO')
.setDescription(`
PIX:

${chave}
`)
.setImage(qr)
.setColor('#00ff88')

interaction.reply({
embeds: [embed]
})
}

// =========================================
// SALA
// =========================================

if (interaction.customId === 'sala') {

const embed = new EmbedBuilder()
.setTitle('🎮 SALA')
.setDescription(`
ID:
123456

Senha:
123456
`)
.setColor('#00ff88')

interaction.reply({
embeds: [embed]
})
}

// =========================================
// FINALIZAR
// =========================================

if (interaction.customId === 'finalizar') {

const aposta = apostas[interaction.channel.id]

if (!aposta) return

const vencedor = aposta[0]
const perdedor = aposta[1]

if (!perfis[vencedor]) {
perfis[vencedor] = {
wins: 0,
loses: 0
}
}

if (!perfis[perdedor]) {
perfis[perdedor] = {
wins: 0,
loses: 0
}
}

perfis[vencedor].wins += 1
perfis[perdedor].loses += 1

interaction.reply('Aposta finalizada.')

setTimeout(() => {
interaction.channel.delete()
}, 5000)
}
})

client.login(process.env.TOKEN)
