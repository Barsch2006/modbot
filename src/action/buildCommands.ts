import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'

export default [
  new SlashCommandBuilder().setName('kick')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescription('Kickt einen User')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, die gekickt werden soll')
        .setRequired(true)
    )
    .addStringOption(
      opt => opt.setName('reason')
        .setDescription('Der Grund für den Kick')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('ban')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription('Bannt einen User')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, die gebannt werden soll')
        .setRequired(true)
    )
    .addStringOption(
      opt => opt.setName('reason')
        .setDescription('Der Grund für den Bann')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('unban')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription('Entbannt einen User')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, die entbannt werden soll')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('warn')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescription('Verwarnt einen User')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, die verwarnt werden soll')
        .setRequired(true)
    )
    .addStringOption(
      opt => opt.setName('reason')
        .setDescription('Der Grund für den Warn')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('history')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescription('Abruf der Historie eines Users')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, dessen Historie eingesehen werden soll')
        .setRequired(true)
    ),
  new SlashCommandBuilder().setName('report')
    .setDescription('Reporte einen User (Missbrauch strafbar)')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, die du reporten möchstest')
        .setRequired(true)
    )
    .addStringOption(
      opt => opt.setName('reason')
        .setDescription('Der Grund für den Report (Nachrichtenlink mitschicken)')
        .setRequired(true)
    ),
    new SlashCommandBuilder().setName('viewreports')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDescription('Abruf der Reports eines Users')
    .addUserOption(
      opt => opt.setName('target')
        .setDescription('Die Person, dessen Reporthistorie eingesehen werden soll')
        .setRequired(true)
    ),
]
