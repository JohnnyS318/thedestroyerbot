const Discord = require("discord.js");
require('dotenv').config()

const client = new Discord.Client();

const isURL = (message = Discord.Message) => {
    return new RegExp(`((^)(.|\n)*(https|http):\/\/.*(${process.env.ELIMINATION_URLS}))\/.*`).test(message.content);
}

client.on("message", function (message) { 
    if (message.author.bot) return;
    if (isURL(message)) {
        console.log("Link detected")
        setTimeout(() => {
            if (process.env.ELIMINATION_SEND_REPLY) {
                console.log("replying")
                message.reply(process.env.ELIMINATION_REPLY_GIF).catch(console.error).then(msg => {
                    msg.delete({ timeout: process.env.ELIMINATION_TIMEOUT });
                }).catch(console.error);
            }
            message.delete({ timeout: 0, reason: "Message contained infected link and was eliminated" }).then(msg => {
                console.log(`eliminated message from ${message.author.username}`);
            }).catch(console.error)
        }, process.env.ELIMINATION_TIMEOUT)
    }
});                                      

client.login(process.env.BOT_TOKEN);
