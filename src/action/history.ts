import { Client, CommandInteraction, EmbedBuilder, GuildMember, Colors } from "discord.js"
import { AsyncDatabase } from '../sqlite/sqlite'

export default async function (client: Client, interaction: CommandInteraction, db: AsyncDatabase): Promise<void> {
    const target = interaction.options.getMember('target') as GuildMember

    try {
        const resultban = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, 'BAN'])
        const resultkick = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, 'KICK'])
        const resultwarn = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, 'WARN'])
        const result = await db.allAsync(`SELECT points FROM records WHERE dc_id = ?`, [target.id])
        let gespoints = 0
        result.forEach((row) => {
            gespoints = gespoints + parseInt(row?.points)
        })
        const dataEmbed = new EmbedBuilder()
            .setTitle(`${target.displayName}`)
            .setThumbnail(`${target.displayAvatarURL()}`)
            .setDescription(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/restrict-plus-operands
                `Joined: ${target.joinedAt?.getDate()}.${(target.joinedAt?.getMonth() ?? 0) + 1}.${target.joinedAt?.getFullYear()}
        Anzahl Banns: ${resultban.length}
        Anzahl Kicks: ${resultkick.length}
        Anzahl Warns: ${resultwarn.length}
        Anzahl Points: ${gespoints}
        `
            )
            .setColor(Colors.Yellow)
            .setTimestamp()
        dataEmbed.addFields({ name: '\u200b', value: '__Warns__' })
        resultwarn.forEach(row => {
            dataEmbed.addFields(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                { name: `Grund:`, value: `\b ${row?.reason}` }
            )
        })
        dataEmbed.addFields({ name: '\u200b', value: '__Kicks__' })
        resultkick.forEach(row => {
            dataEmbed.addFields(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                { name: `Grund:`, value: `\b ${row?.reason}` }
            )
        })
        // Banns
        dataEmbed.addFields({ name: '\u200b', value: '__Banns__' })
        resultban.forEach(row => {
            dataEmbed.addFields(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                { name: `Grund:`, value: `\b ${row?.reason}` }
            )
        })
        await interaction.reply({
            embeds: [
                dataEmbed
            ]
        })
    } catch (e) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription('Abruf ist fehlgeschlagen.')
            ]
        })
    }
}