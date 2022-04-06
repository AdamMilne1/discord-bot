const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const wowclientid = process.env.wowclientid;
const wowsecret = process.env.wowsecret;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Lookup wow character')
        .addStringOption(option => option.setName('charname').setDescription('Enter character name.').setRequired(true))
        .addStringOption(option => option.setName('realm').setDescription('Enter realm name.').setRequired(true)),

	async execute(interaction) {
        const charname = interaction.options.getString('charname');
        const realm = interaction.options.getString('realm');
        console.log([charname, realm]);

        //get access token.
        let access = await axios.post(`https://us.battle.net/oauth/token`, 'grant_type=client_credentials', {
            auth : {
            username: wowclientid,
            password: wowsecret},
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        const accesstoken = access.data.access_token;


        let resp = await axios.get(`https://us.api.blizzard.com/profile/wow/character/${realm}/${charname}?namespace=profile-us&locale=en_US&access_token=${accesstoken}`);

        console.log(resp.data);

        // https://us.api.blizzard.com/profile/wow/character/frostmourne/noozcheese?namespace=profile-us&locale=en_US&access_token=USLORbonJ5D7deWHwLmZkESO6Zji0dQ9C3

        await interaction.reply(charname);
        
	},
};