import dotenv from 'dotenv'
import { Client, DMChannel, IntentsBitField } from 'discord.js'
import interactionCreate from './listeners/interactioncreate'
import registerCommands from './action/registerCommands'
import { AsyncDatabase } from './sqlite/sqlite'

async function init(): Promise<void> {
    dotenv.config()

    const token = process.env.BOT_TOKEN

    const dbFile = process.env.DB_PATH ?? './sqlite3.db'


    const db = await AsyncDatabase.open(dbFile)
    await db.serializeAsync(async () => {
        await db.runAsync(`CREATE TABLE IF NOT EXISTS records(
            identifier INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
            dc_id TEXT NOT NULL,
            type TEXT NOT NULL,
            points INTEGER NOT NULL,
            reason TEXT NOT NULL
        )`)
    })

    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds
        ]
    })
    interactionCreate(client, db)
    registerCommands(client)
    await client.login(token)
    console.log("Bot logged in..")
}
void init()
