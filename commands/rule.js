const components = require('../components/export');
const rules = require('../data/rules.json');

async function rule(interaction) {
    let selection = interaction.options.getString("rule")
    if (selection.includes("separator")) {
        return interaction.reply({content: 'Why did you select the separator? Please do not select the separator meant to separate things because it is meant to separate things that need to be separated, and it is not meant to be selected. Like really, could you control yourself? You shouldnt listen to your intrusive thoughts bro like what did you think would happen? did you really think you\'d get an ephemeral message telling you "Why did you select the separator? Please do not select the separator meant to separate things because it is meant to separate things that need to be separate..." oh wait-', ephemeral:true});
    } else if (selection.length==5) {
        return interaction.reply(components.rule(rules[selection]["title"], rules[selection]["content"].join("\n"), rules[selection]["url1"], rules[selection]["url2"]))
    } else if (selection.length==3) {
        return interaction.reply(components.rule(rules["rule"+selection[0]]["subrules"][selection[2]]["title"], rules["rule"+selection[0]]["subrules"][selection[2]]["content"].join("\n"), rules["rule"+selection[0]]["url1"], rules["rule"+selection[0]]["subrules"][selection[2]]["url"], true))
    } else {
        return interaction.reply("This rule is unavailable at the moment.");
    }
    
}

module.exports = rule;