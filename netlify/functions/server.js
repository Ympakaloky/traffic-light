const express = require("express");
const { google } = require("googleapis");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit", async (req, res) => {
  const { request, name } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "15L2GaQzv-3tsYHaRiikglnq-_S2pUlfFyWZh8n2vlkw";

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[request, name]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.get("/requests", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "15L2GaQzv-3tsYHaRiikglnq-_S2pUlfFyWZh8n2vlkw";

  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:B",
  });

  const rows = response.data.values || [];
  const requests = rows.map((row) => ({ request: row[0], name: row[1] }));

  res.json(requests);
});

app.post("/update", async (req, res) => {
  const { index, request, name } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "15L2GaQzv-3tsYHaRiikglnq-_S2pUlfFyWZh8n2vlkw";

  await googleSheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${index + 1}:B${index + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[request, name]],
    },
  });

  res.send("Successfully updated!");
});

app.post("/delete", async (req, res) => {
  const { index } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "15L2GaQzv-3tsYHaRiikglnq-_S2pUlfFyWZh8n2vlkw";

  await googleSheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `Sheet1!A${index + 1}:B${index + 1}`,
  });

  res.send("Successfully deleted!");
});

app.listen(1337, () => console.log("running on 1337"));
