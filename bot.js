require('dotenv').config()
const token = process.env.token //contains auth token, secret

const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
















// // Configure logger settings

// logger.remove(logger.transports.Console);

// logger.add(new logger.transports.Console, {

// colorize: true
// });

// logger.level = 'debug';

// // Initialize Discord Bot

// var bot = new Discord.Client({

// token: process.env.token,

// autorun: true

// });

// bot.on('ready', function (evt) {

// logger.info('Connected');

// logger.info('Logged in as: ');

// logger.info(bot.username + ' - (' + bot.id + ')');
// });

// bot.on('message', function (user, userID, channelID, message, evt) {

// // Our bot needs to know if it will execute a command

// // It will listen for messages that will start with `!`

// if (message.substring(0, 1) == '!') {

//     var args = message.substring(1).split(' ');

//     var cmd = args[0];


//     args = args.splice(1);

//     switch(cmd) {

//         // !ping

//         case 'ping':

//             bot.sendMessage({

//                 to: channelID,

//                 message: 'Pong!'

//             });

//         break;

//         // Just add any case commands if you want to..

//      }

//  }
// });