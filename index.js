const Anthropic = require('@anthropic-ai/sdk');
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API,
});

const commands = [
    new SlashCommandBuilder().setName('한강온도').setDescription('한강의 수온을 출력할..까?').setContexts([0]),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

client.once('ready', async (readyClient) => {
   // try {
   //     await rest.put(
   //         Routes.applicationCommands(process.env.CLIENT_ID),
   //         { body: [] },
   //     );
   //     console.log('Successfully reset commands.');
   //     await rest.put(
   //         Routes.applicationCommands(process.env.CLIENT_ID),
   //         { body: commands },
   //     );
   //     console.log('Successfully registered commands.');
   // } catch (error) {
   //     console.error(error);
   // }
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

client.on('interactionCreate', async (interaction) => {
    if (interaction.commandName === "한강온도") {
        await interaction.deferReply();
        const rNumber = Math.floor(Math.random() * 10);

        switch (rNumber) {
            case 1:
                await interaction.editReply('https://tenor.com/view/cat-dance-dancing-cat-chinese-dancing-cat-funny-cat-meme-cat-gif-18059553370350307210');
                break;
            case 2:
                await interaction.editReply('https://tenor.com/view/crunchycat-luna-cat-smirk-smile-gif-9301919548442205824');
                break;
            case 3:
                await interaction.editReply('https://tenor.com/view/besito-catlove-gif-11397231996208728070');
                break;
            case 4:
                await interaction.editReply('https://tenor.com/view/mikisi-kisi-kiss-gif-27218966');
                break;
            case 5:
                await interaction.editReply('https://tenor.com/view/kitty-cat-sandwich-cats-sandwich-gif-26112528');
                break;
            case 6:
                await interaction.editReply('https://tenor.com/view/plink-cat-plink-cat-gif-1794292671885121408');
                break;
            case 7:
                await interaction.editReply('https://tenor.com/view/cats-licking-cats-love-cat-couple-cats-couple-love-cats-gif-21645348');
                break;
            case 8:
                await interaction.editReply('https://tenor.com/view/cute-friends-snuggle-cat-gif-4468606');
                break;
            case 9:
                await interaction.editReply('https://tenor.com/view/angry-cat-sour-cat-cat-meme-cat-gif-3861401041477966516');
                break;
            case 10:
                await interaction.editReply('https://tenor.com/view/dog-cat-gif-20655915');
                break;
        }

    }
})

client.on('messageCreate', async msg => {
    if (msg.author.bot) return;

    if (msg.content.startsWith("비챤아")) {
        try {
            // 타이핑 시작
            await msg.channel.sendTyping();
            const userMsg = msg.content.substring(3);

            if (!userMsg) {
                await msg.reply('왜 불러');
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