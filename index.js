const Anthropic = require('@anthropic-ai/sdk');
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs')
const path = require('node:path');

require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API,
});

client.once('ready', (readyClient) => {
    console.log(`봇 실행 완료! 계정: ${readyClient.user.tag}`);
})

async function createMsg(msg) {
    result = await anthropic.messages.create({
        model: "claude-3-5-haiku-latest",
        max_tokens: 512,
        messages: [{role: "assistant", content: "너는 신병교육대의 AI 챗봇, 비챤이야. 친절하고 귀엽게 꼭 반말로 대답해"},{ role: "user", content: msg }],
    });

    return(result.content[0].text);
}

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;

    if (msg.mentions.has(client.user)) {
        try {
            // 타이핑 시작
            const typing = await msg.channel.sendTyping();
            const userMsg = msg.content.replace(/<@!?\d+>/g, '').trim();

            if (!userMsg) {
                await msg.reply('왜');
                return;
            }

            // 메시지 보내고 바로 타이핑 상태 종료
            await msg.channel.send(await createMsg(userMsg));

        } catch (error) {
            console.error('Error:', error);
            await msg.reply(`오류; ${error.message}`);
        }
    }
});

client.login(process.env.TOKEN);