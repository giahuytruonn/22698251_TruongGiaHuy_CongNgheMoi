const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
require("dotenv").config();

const { ensureProductsTable } = require("./services/dynamodb");
const productRoutes = require("./routes/product.routes");

const app = express();
const port = process.env.APP_PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.redirect("/products"));
app.use("/products", productRoutes);

ensureProductsTable()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to ensure DynamoDB table", err);
    process.exit(1);
  });

