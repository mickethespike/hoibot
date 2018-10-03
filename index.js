const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const prefix = 'pls ';

let countries;
fs.readFile('countries.json', 'utf8', (err, data) => {
  if (err)
    throw err;
  countries = JSON.parse(data);
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix)) {
    return;
  }

  let msgArgList = msg.content.split(prefix)[1].split(' ');
  let msgc = msgArgList[0].toLowerCase();

  switch (msgc) {
    case 'ping':
      msg.reply('Pong!');
      break;

    case 'gib':
      const desired_country = msgArgList[1];
      const username = msg.author.username + "#" + msg.author.discriminator;
      const index = take_country(desired_country, username);
      if (index >= 0) {
        countries[index].author = username;
        const aChannel = client.channels.find(c => c.name === "announcements");

        const fetched = await aChannel.fetchMessages({limit: 99});
        aChannel.bulkDelete(fetched);

        let message = '';
        for (i = 0; i < 65; i++) {
          if (countries[i].author) {
            message += `${countries[i].name}: ${countries[i].author}\n`;
          }
        }
        aChannel.send(message);
      }
      break;

    default:
      msg.reply('Command not found: ' + msgc);
      break;
  }

  function take_country(desired_country, username) {
    for (i = 0; i < 65; i++) {
      if (countries[i].author === username) {
        msg.reply('you have already chosen a country');
        return -1;
      }
    }

    for (i = 0; i < 65; i++) {
      if (desired_country === countries[i].name && !countries[i].taken) {
        msg.reply('gave you the country ' + msgArgList[1]);
        countries[i].taken = true;

        return i;
      }
    }

    msg.reply('the country is taken or doesn\'t exist');
    return -1;
  }
});

client.login(process.env.token);
