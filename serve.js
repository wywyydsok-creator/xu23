const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 8083;
const ROOT = __dirname;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg"
};
const srv = http.createServer((req, res) => {
  let u = decodeURI(req.url.split("?")[0]);
  if (u === "/") u = "/index.html";
  const f = path.join(ROOT, u);
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); res.end(""); return; }
    const ext = path.extname(f).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});
srv.listen(PORT, "127.0.0.1", () => console.log("OK"));
