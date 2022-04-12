import express from "express";
import { TreasureMapBot } from "./bot";
import {
    askAndParseEnv,
    identity,
    parseLogin,
    requireAndParseEnv,
    requireEnv
} from "./lib";

async function main() {
    const params = requireAndParseEnv("LOGIN", parseLogin);
    const port = requireEnv("PORT")
    const app = express()

    const bot = new TreasureMapBot(
        params,
        askAndParseEnv("TELEGRAM_KEY", identity, "")
    );

    process.once("SIGINT", () => {
        bot.stop();
        process.exit();
    });
    process.once("SIGTERM", () => {
        bot.stop();
        process.exit();
    });

    app.get('/config', async (req, res) => {
        const data = await bot.getConfig()
        res.json(data)
    })

    app.get('/rewards', async (req, res) => {
        const data = await bot.getRewards()
        res.json(data)
    })

    app.get('/stats', async (req, res) => {
        const data = await bot.getStats()
        res.json(data)
    })

    app.listen(port, () => {
        console.info(`app listening on port ${port}`)
    })

    await bot.loop();
}

main();
