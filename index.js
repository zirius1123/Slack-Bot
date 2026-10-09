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
    // Use the user's text input (like "GD01-001"). If blank, default to "GD01-001"
    const cardId = command.text ? command.text.trim() : "GD01-001"; 
    
    const response = await axios.get(`https://gcgapi.com{cardId}`); 
    
    if (response.data && response.data.data) { 
      const card = response.data.data; 
      
      await respond({ 
        text: `${card.name} (${card.card_number})\n- Set: ${card.set_name}\n- Type: ${card.card_type}\n- Color: ${card.color}\n- Trait: ${card.trait}\n- Source: ${card.source_title}\n- Effect: ${card.effect}` 
      }); 
    } else { 
      await respond({ text: `Could not find card data for "${cardId}".` }); 
    } 
  } catch (err) { 
    console.error(err.message); 
    await respond({ 
      text: "Failed to fetch Gundam card data. Make sure you entered a valid card ID (like GD01-001)." 
    }); 
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