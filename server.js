const app = require('./app/index');

app.listen(process.env.PORT || 5000, () => {
  console.log("running server");
});