require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./config/database");
const routes = require("./routes/index");
const webRoutes = require("./routes/web");

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized. ");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
  try {
    await sequelize.authenticate();
    console.log("Database synchronized authenticate.");
  } catch (error) {
    console.error("Error synchronizing the database authenticate:", error);
  }
})();

app.use(express.json());
app.use("/api", routes);
app.use("/web", webRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
