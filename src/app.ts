import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";

const app = express();
const port = parseInt(process.env.PORT!, 10) || 3000;
app.use(bodyParser.json({ limit: "100mb" }));

app.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});
