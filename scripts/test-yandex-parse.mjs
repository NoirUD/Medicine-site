import fs from "fs";

const html = fs.readFileSync("tmp-yandex.html", "utf8");
const match = html.match(/m\.innerHTML='(\{.*?\})'/);
if (match) {
  const jsonStr = match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const data = JSON.parse(jsonStr);
  console.log("reviews count:", data.review?.length);
  console.log(JSON.stringify(data.review?.slice(0, 2), null, 2));
}
