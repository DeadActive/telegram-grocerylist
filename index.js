const Telegraf = require("telegraf");
const CONFIG = require("./config.json");
const MongoClient = require("mongodb").MongoClient;
const http = require("http");

const bot = new Telegraf(CONFIG.api_token);

const requestHandler = (request, response) => {
	console.log(request.url);
	response.end("Hello Node.js Server!");
};
const server = http.createServer(requestHandler);
server.listen(process.env.PORT, err => {
	if (err) {
		return console.log("something bad happened", err);
	}
	console.log(`server is listening on ${process.env.PORT}`);
});

MongoClient.connect(
	process.env.MONGODB_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	(err, client) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log("connected");
		const db = client.db("datebase");
		const collection = db.collection("lists");

		bot.command("test", ctx => {
			console.log(JSON.stringify(ctx.from));
			collection.insertOne({ user_id: ctx.from.userid }, (err, res) => {
				if (err) {
					ctx.reply("Error");
					return;
				}
				ctx.reply("Added");
			});
		});

		bot.command("get", ctx => {
			collection.find({ user_id: ctx.from.userid }).toArray((err, items) => {
				if (err) {
					ctx.reply("Not found");
					return;
				}

				ctx.reply(JSON.stringify(items));
			});
		});
	}
);
bot.start(ctx => ctx.reply("Добро пожаловать"));

bot.launch();
