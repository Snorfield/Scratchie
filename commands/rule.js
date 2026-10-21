const components = require('../components/export');
const rules = require('../data/rules.json');

async function rule(interaction) {
    let selection = interaction.options.getString("rule")
    if (selection.includes("separator")) {
        return interaction.reply({content: 'no.', ephemeral:true});
    } else if (selection.length==5) {
        return interaction.reply(components.rule(rules[selection]["title"], rules[selection]["content"].join("\n"), rules[selection]["url1"], rules[selection]["url2"]))
    } else if (selection.length==3) {
        return interaction.reply(components.rule(rules["rule"+selection[0]]["subrules"][selection[2]]["title"], rules["rule"+selection[0]]["subrules"][selection[2]]["content"].join("\n"), rules["rule"+selection[0]]["url1"], rules["rule"+selection[0]]["subrules"][selection[2]]["url"], true))
    } else {
        return interaction.reply("This rule is unavailable at the moment.");
    }
    
}

module.exports = rule;