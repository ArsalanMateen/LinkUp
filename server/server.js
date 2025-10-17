import app from "./express.js";

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.info("Server started on port %s.", port);
});
