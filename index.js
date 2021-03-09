const Discord = require("discord.js");
const {createRoom} = require("./w2g")
require('dotenv').config()

const client = new Discord.Client();


const isURL = (message = Discord.Message) => {
    return new RegExp(`((^)(.|\n)*(https|http):\/\/.*(${process.env.ELIMINATION_URLS}))\/.*`).test(message.content);
}

client.on("message", function (message) {
    if (message.author.bot) return;

    console.log("Message: ", message.content)

    if (message.content.startsWith(process.env.COMMAND_IDENTIFIER)) {

        const msg = message.content.substr(1, message.content.length - 1)
        if (msg.startsWith("w2g")) {
            const parts = msg.split(" ");
            createRoom(parts.length >= 2 ? parts[1] : "").then(link => {
                message.reply("Watch2gether link is: " + "https://w2g.tv/rooms/" + link).catch(console.error).then(reply => {
                    console.log("Link published: " + link)
                    reply.delete({timeout: "7200000"})
                })
            });
        }
    }

    if (isURL(message)) {
        console.log("Link detected")
        setTimeout(() => {
            if (process.env.ELIMINATION_SEND_REPLY) {
                console.log("replying")
                message.reply(process.env.ELIMINATION_REPLY_GIF).catch(console.error).then(msg => {
                    msg.delete({timeout: process.env.ELIMINATION_TIMEOUT});
                }).catch(console.error);
            }
            message.delete({timeout: 0, reason: "Message contained infected link and was eliminated"}).then(msg => {
                console.log(`eliminated message from ${message.author.username}`);
            }).catch(console.error)
        }, process.env.ELIMINATION_TIMEOUT)
    }
});

client.login(process.env.BOT_TOKEN);
