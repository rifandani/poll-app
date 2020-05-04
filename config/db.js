const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

// mongoose connect
const mongoDB =
  'mongodb://rifandani:rifandani@cluster0-shard-00-00-rqaap.mongodb.net:27017/pusherpoll?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primaryPreferred&appname=MongoDB%20Compass&ssl=true';
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));
