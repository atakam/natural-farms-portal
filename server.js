const app = require('./app/index');
const path = require('path');
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => {
  console.log("running server");
});