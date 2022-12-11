import { ChannelType, Client, Colors, CommandInteraction, EmbedBuilder } from 'discord.js'
import { AsyncDatabase } from '../sqlite/sqlite'

export default async (client: Client, interaction: CommandInteraction, db: AsyncDatabase): Promise<void> => {
    if (!interaction.isRepliable()) {
        return
    }

    const target = interaction.options.get('target', true).value?.toString() ?? ''
    const reason = interaction.options.get('reason', true).value?.toString() ?? ''
    let dmSucess: boolean

    const kickEmbed = new EmbedBuilder()
        .setTitle('User wurde gekickt')
        .setDescription(`<@${target}> wurde erfolgreich gekickt und wurde benachrichtigt.`)
        .setColor('Yellow')
        .setAuthor({ name: `Gekickt von: ${interaction.user.tag}` })
        .setTimestamp()

    const dmDisabled = new EmbedBuilder()
        .setTitle('User wurde gekickt')
        .setDescription(`<@${target}> wurde erfolgreich gekickt. Die Banachrichtigung konnte nicht verschickt werden.`)
        .setColor('Yellow')
        .setAuthor({ name: `Gekickt von: ${interaction.user.tag}` })
        .setTimestamp()
        .addFields({ name: 'Grund', value: reason })

    try {
        await interaction.guild?.members.kick(target, reason)
        try {
            await (await client.users.fetch(target)).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Kick')
                        .setDescription('Aufgrund deines Verhaltens wurdest du vom Server gekickt. Wir bitten dich zukünftig unsere Regeln zu beachten. Bist du der Meinung, zu unrecht gekickt worden zu sein, melde dich bitte bei uns persönlich.')
                        .addFields({ name: 'Grund', value: reason })
                        .setColor(Colors.Red)
                ]
            })
            dmSucess = true
        } catch (e) {
            dmSucess = false
        }
        if (dmSucess) {
            await interaction.reply({ embeds: [kickEmbed], ephemeral: true })
        } else {
            await interaction.reply({ embeds: [dmDisabled], ephemeral: true })
        }
        await db.runAsync(`INSERT INTO records(dc_id, type, points, reason) VALUES(?,?,?,?)`, [target, "KICK", "100", reason])
        const channel = await interaction.guild?.channels.fetch(process.env.MOD_LOG_CHANNEL ?? '')
        if ((channel == null) || channel?.type !== ChannelType.GuildText) {
            return
        }
        await channel.send({
            embeds: [kickEmbed]
        })
    } catch (e) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription('Der Kick ist fehlgeschlagen.')
            ],
            ephemeral: true
        })
        return
    }
}
