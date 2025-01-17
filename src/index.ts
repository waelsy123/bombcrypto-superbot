import express from "express";
import { TreasureMapBot } from "./bot";
import {
    askAndParseEnv,
    identity,
    parseBoolean,
    parseLogin,
    requireAndParseEnv,
    requireEnv,
} from "./lib";

export let block_reward_type = 1;

async function main() {
    const params = requireAndParseEnv("LOGIN", parseLogin);
    const port = requireEnv("PORT");
    const app = express();

    const bot = new TreasureMapBot(params, {
        telegramKey: askAndParseEnv("TELEGRAM_KEY", identity, ""),
        minHeroEnergyPercentage: parseInt(
            askAndParseEnv("MIN_HERO_ENERGY_PERCENTAGE", identity, "50")
        ),
        modeAmazon: askAndParseEnv("MODE_AMAZON", parseBoolean, false),
        modeAdventure: askAndParseEnv("MODE_ADVENTURE", parseBoolean, false),
        houseHeroes: askAndParseEnv("HOUSE_HEROES", identity, ""),
    });

    process.once("SIGINT", async () => {
        await bot.stop();
        process.exit();
    });
    process.once("SIGTERM", async () => {
        await bot.stop();
        process.exit();
    });

    app.get("/config", async (req, res) => {
        const data = await bot.getConfig();
        res.json(data);
    });

    app.get("/rewards", async (req, res) => {
        const data = await bot.getRewards();
        res.json(data);
    });

    app.get("/claim/bcoin", async (req, res) => {
        block_reward_type = 1;
        const data = await bot.claim();
        res.json(data);
    });

    app.get("/claim/sen", async (req, res) => {
        block_reward_type = 7;
        const data = await bot.claim();
        res.json(data);
    });

    app.get("/stats", async (req, res) => {
        const data = await bot.getStats();
        res.json(data);
    });

    app.listen(port, () => {
        console.info(`app listening on port ${port}`);
    });

    await bot.loop();
}

main();
