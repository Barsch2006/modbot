import { Routes, Client } from 'discord.js'
import { REST } from '@discordjs/rest'
import CommandList from './buildCommands'

export default (client: Client): void => {

    const rest = new (REST)({ version: '10' }).setToken(process.env.BOT_TOKEN ?? '')

    client.once('ready', async () => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const [_, g] of client.guilds.cache) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.APPLICATION_ID ?? '', g.id),
                { body: CommandList }
            )
        }
    })
}
