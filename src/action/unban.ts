import { ChannelType, Client, Colors, CommandInteraction, EmbedBuilder } from 'discord.js'
import { AsyncDatabase } from '../sqlite/sqlite'

export default async (client: Client, interaction: CommandInteraction, db: AsyncDatabase): Promise<void> => {
    if (!interaction.isRepliable()) {
        return
    }

    const target = interaction.options.get('target', true).value?.toString() ?? ''
    let dmSucess: boolean

    const kickEmbed = new EmbedBuilder()
        .setTitle('User wurde entbannt')
        .setDescription(`<@${target}> wurde erfolgreich entbannt und wurde benachrichtigt.`)
        .setColor('Green')
        .setAuthor({ name: `Entbannt von: ${interaction.user.tag}` })
        .setTimestamp()

    const dmDisabled = new EmbedBuilder()
        .setTitle('User wurde entbannt')
        .setDescription(`<@${target}> wurde erfolgreich entbannt. Die Banachrichtigung konnte nicht verschickt werden.`)
        .setColor('Green')
        .setAuthor({ name: `Entbannt von: ${interaction.user.tag}` })
        .setTimestamp()

    try {
        await interaction.guild?.members.unban(target)
        try {
            await (await client.users.fetch(target)).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Entbannung')
                        .setDescription('Aufgrund deines Verhaltens wurdest du früher vom Server gebannt. Wir bitten dich zukünftig unsere Regeln zu beachten. Deine Entbannung wurde aufgehoben.')
                        .setColor(Colors.Green)
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
                new EmbedBuilder().setDescription('Die Entbannung ist fehlgeschlagen.')
            ],
            ephemeral: true
        })
        return
    }
}
