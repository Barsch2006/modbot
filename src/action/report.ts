import { ChannelType, Client, Colors, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js'
import { AsyncDatabase } from '../sqlite/sqlite'
import dotenv from 'dotenv'
dotenv.config()

export default async (client: Client, interaction: CommandInteraction, db: AsyncDatabase): Promise<void> => {
    if (!interaction.isRepliable()) {
        return
    }

    const target = interaction.options.getMember('target') as GuildMember
    const reason = interaction.options.get('reason', true).value?.toString() ?? ''

    const sendEmbed = new EmbedBuilder()
        .setTitle('Report gesendet')
        .setDescription(`Dein Report wurde ans Team übermittelt`)
        .setColor('Yellow')
        .setAuthor({ name: `Report von ${interaction.user.tag}` })
        .setTimestamp()
    const reportEmbed = new EmbedBuilder()
        .setTitle('new Report')
        .setDescription('Ein Report wurde abgegeben')
        .setColor('Yellow')
        .setAuthor({ name: `Report von ${interaction.user.tag}` })
        .addFields([
            { name: "Reported", value: `${target}` },
            { name: "Grund", value: `${reason}` }
        ])
        .setTimestamp()
    try {
        await db.runAsync(`INSERT INTO records(dc_id,type,points,reason) VALUES(?,?,?,?)`, [target.id, "REPORT","0",reason])
        const channel = await interaction.guild?.channels.fetch(process.env.REPORTS_CHANNEL ?? '')
        if ((channel == null) || channel?.type !== ChannelType.GuildText) {
            return
        }
        await channel.send({
            embeds: [reportEmbed]
        })
        await interaction.reply({ embeds: [sendEmbed], ephemeral: true })
        } catch (e) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription('Der Report ist fehlgeschlagen.')
                ],
                ephemeral: true
            })
            return
        }
    }