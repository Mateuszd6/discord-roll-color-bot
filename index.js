require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    // Prevent bot from responding to its own messages
    if (msg.author == client.user) {
        return
    }

    var fullCommand = "";
    var invokedByName = false;

    // Check if the bot's user was tagged in the message
    if (msg.content.startsWith(client.user.toString())) {
        fullCommand = msg.content.substr(client.user.toString().length).trim();
        invokedByName = true;
    }
    else if (msg.content.startsWith("!")) {
        fullCommand = msg.content.substr(1);
    }

    console.log("Command: " + fullCommand);

    if (fullCommand == "rollcolor") {
        rollColor(msg)
    }
    else if (fullCommand == "rolldice") {
        rollDice(msg)
    }
    else if (invokedByName) {
        console.log("Displaying help msg");

        msg.channel.send("Commands can be invoked using `![command]` or " +
                         "by `@CRoll Bot [command]`.\nSupported commands:\n" +
                         "\trollcolor - roll a random color.\n" +
                         "\trolldice - roll a dice.\n" +
                         "\nMore will never come out. Have fun.");
    }
    else {
        console.log("I don't understand the command.")
    }
});

client.login(process.env.BOT_TOKEN)

function rollColor(msg) {
    var fs = require('fs'),
        PNG = require('pngjs').PNG;

    var stream = fs.createReadStream('./in.png');

    stream.pipe(new PNG({filterType: 4}))
        .on('parsed', function() {
            var bg_colour = Math.floor(Math.random() * 16777215);
            var r = (bg_colour >> 16) % 256;
            var g = (bg_colour >> 8) % 256;
            var b = bg_colour % 256;
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var idx = (this.width * y + x) << 2;
                    this.data[idx] = r;
                    this.data[idx+1] = g;
                    this.data[idx+2] = b;
                    this.data[idx+3] = 255;
                }
            }

            var outstr = fs.createWriteStream('out.png');
            this.pack().pipe(outstr)
                .on('finish', function() {
                    console.log("Done preparing. Sending");
                    msg.channel.send(msg.author.toString() + " rolls color:",
                                     {files: ["./out.png"]});
                });
        });
}

function rollDice(msg) {
    var random = Math.floor(Math.random() * 1000000000) % 6 + 1;
    var file = "./dice" + random + ".png";

    msg.channel.send(msg.author.toString() + " rolls dice:",
                     {files: [file]});

}
