const components = require('../components/export');
const rules = require('../data/rules.json');
const { PermissionFlagsBits } = require('discord.js');
const users = require('../data/users.json');

async function rule(interaction) {
if ( 
    interaction.user.id === `{users.John}` ||
    interaction.member?.permissions.has(PermissionFlagsBits.ModerateMembers)
  ) {
    const selection = interaction.options.getString("rule");

    if (selection.endsWith("separator")) {
        return interaction.reply({ content: 'no.', ephemeral: true });
    } else if (selection.length === 5) {
        return interaction.reply(
          components.rule(
            rules[selection].title, 
            rules[selection].content.join("\n"), 
            rules[selection].url1, 
            rules[selection].url2
          )
        )
    } else if (selection.length === 3) {
        return interaction.reply(
          components.rule(
            rules["rule"+selection[0]].subrules[selection[2]].title,
            rules["rule"+selection[0]].subrules[selection[2]].content.join("\n"),
            rules["rule"+selection[0]].url1, rules["rule"+selection[0]].subrules[selection[2]].url,
            true
        )
    )
   } else {
    return interaction.reply("This rule is unavailable at the moment.");
   }
  } else {
    return interaction.reply({ content: "Sorry, this command is for staff usage only. You can view the rules at https://discord.com/channels/1140996822131802192/1140996822903566347", ephemeral: true });
  }
}

module.exports = rule;
