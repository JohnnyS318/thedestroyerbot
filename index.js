import {createRoom} from "./w2g";

const Discord = require("discord.js");
require('dotenv').config()

const client = new Discord.Client();


const isURL = (message = Discord.Message) => {
    return new RegExp(`((^)(.|\n)*(https|http):\/\/.*(${process.env.ELIMINATION_URLS}))\/.*`).test(message.content);
}

client.on("message", function (message) { 
    if (message.author.bot) return;

    if (message.content.startsWith(">")) {
        const msg = message.content.substr(0,1)
        if(msg.startsWith("w2g")){
            const parts = msg.split(" ");
            const link = createRoom(parts.length > 2 ? parts[1] : "");
            message.reply("Watch2gether link is: " + link).catch(console.error).then(() => {
                console.log("Link published: " + link)
            })
        }
    }

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
