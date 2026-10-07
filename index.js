const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/barbatos5-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
app.command("/barbatos5-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
app.command("/barbatos5-gundam", async ({ command, ack, respond }) => {
  await ack();

  try {
    const searchQuery = command.text ? `?name=${encodeURIComponent(command.text)}` : '';
    const response = await axios.get(`http://localhost:3000/gunpla${searchQuery}`);

    if (response.data.data && Array.isArray(response.data.data)) {
      if (response.data.data.length === 0) {
        await respond({ text: `No Gundam kits found matching "${command.text}".` });
        return;
      }

      const kitList = response.data.data.map(kit => 
        `🤖 *${kit.name}*\n• Series: ${kit.series}\n• Price: ${kit.price}\n• Release: ${kit.release}`
      ).join('\n\n');

      await respond({ text: `Here are the matching kits I found:\n\n${kitList}` });
    } else if (response.data.data) {
      const kit = response.data.data;
      await respond({
        text: `*${kit.name}*\n• Series: ${kit.series}\n• Manufacturer: ${kit.manufacturer}\n• Height: ${kit.height}m\n• Price: ${kit.price}\n• Release: ${kit.release}`
      });
    } else {
      await respond({ text: "Could not find any data." });
    }

  } catch (err) {
    await respond({ text: "Failed to fetch Gundam data." });
  }
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();
app.command("/barbatos5-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/barbatos5-ping - Check bot latency
/barbatos5-catfact - Get a cat fact`
  });
});