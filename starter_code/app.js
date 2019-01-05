const express = require("express");
const hbs = require("hbs");
const app = express();
const path = require("path");
const PunkAPIWrapper = require("punkapi-javascript-wrapper");
const punkAPI = new PunkAPIWrapper();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));

//Ruta de las vistas parciales
hbs.registerPartials(path.join(__dirname, "/views/partials"));

hbs.registerHelper("grouped_each", function(every, context, options) {
  var out = "",
    subcontext = [],
    i;
  if (context && context.length > 0) {
    for (i = 0; i < context.length; i++) {
      if (i > 0 && i % every === 0) {
        out += options.fn(subcontext);
        subcontext = [];
      }
      subcontext.push(context[i]);
    }
    out += options.fn(subcontext);
  }
  return out;
});

//Home
app.get("/", (req, res) => {
  res.render("index");
});

//Beer route
app.get("/beers", (req, res) => {
  punkAPI
    .getBeers()
    .then(beers => {
      res.render("beers", { beers });
    })
    .catch(console.error);
});

//Random beer
app.get("/random-beer", (req, res) => {
  punkAPI
    .getRandom()
    .then(beers => {
      res.render("randomBeer", beers[0]);
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(3000, () => {
  console.log("Server running!!!");
});
