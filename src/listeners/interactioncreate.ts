import {
    CommandInteraction, Client, Interaction, ChannelType, GuildBasedChannel,
} from 'discord.js'
import { AsyncDatabase } from '../sqlite/sqlite'
import kick from '../action/kick'
import ban from '../action/ban'
import unban from '../action/unban'
import warn from '../action/warn'
import history from '../action/history'
import report from '../action/report'
import viewreports from '../action/viewreports'

export default (client: Client, db: AsyncDatabase): void => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await handleSlashCommand(client, interaction, db)
        }
    })
}
const handleSlashCommand = async (client: Client, interaction: CommandInteraction, db: AsyncDatabase): Promise<void> => {
    let channel: GuildBasedChannel | null
    // handle slash command here
    switch (interaction.commandName) {
        case 'kick':
            kick(client, interaction, db)
            return
        case 'ban':
            ban(client, interaction, db)
            return
        case 'unban':
            unban(client, interaction, db)
            return
        case 'warn':
            warn(client, interaction, db)
            return
        case 'history':
            history(client, interaction, db)
            return
        case 'report':
            report(client, interaction, db)
            return
        case 'viewreports':
            viewreports(client, interaction, db)
            return
    }
}