const fetch = require("node-fetch");

const createRoom = async (url = "") => {
    console.log("Creating Room... with default link: " + url)
    const res = await fetch("https://w2g.tv/rooms/create.json", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "w2g_api_key": process.env.W2G_API_KEY,
            "share": url,
            "bg_color": "#000000",
            "bg_opacity": "50"
        })
    });
    const data = await res.json();
    return data.streamkey;
}
module.exports = {
    createRoom: createRoom
}