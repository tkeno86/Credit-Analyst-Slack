app.get("/", (req, res) => {
  res.send("Slack PDF Analyst backend is running.");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Empty response to stop errors
});


