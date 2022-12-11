import { Client, CommandInteraction, EmbedBuilder, GuildMember, Colors } from "discord.js"
import { AsyncDatabase } from '../sqlite/sqlite'

export default async function (client: Client, interaction: CommandInteraction, db: AsyncDatabase): Promise<void> {
    const target = interaction.options.getMember('target') as GuildMember

    try {
        const resultban = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, 'BAN'])
        const resultkick = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, 'KICK'])
        const resultwarn = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, 'WARN'])
        const resultreports = await db.allAsync(`SELECT * FROM records WHERE dc_id = ? AND type = ?`, [target.id, "REPORT"])
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
        Anzahl Reports: ${resultreports.length}
        Anzahl Points: ${gespoints}
        `
            )
            .setColor(Colors.Yellow)
            .setTimestamp()
        dataEmbed.addFields({ name: '\u200b', value: '__Reports__' })
        resultreports.forEach(row => {
            dataEmbed.addFields(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                { name: `Grund:`, value: `\b ${row?.reason}` }
            )
        })
        await interaction.reply({
            embeds: [
                dataEmbed
            ], ephemeral: true
        })
    } catch (e) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription('Abruf ist fehlgeschlagen.')
            ]
        })
    }
}