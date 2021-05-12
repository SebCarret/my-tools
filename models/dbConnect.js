import mongoose from 'mongoose';

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const options = {
            connectTimeoutMS: 5000,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, options).then((mongoose) => {
            console.log('connection to myTools DB OK !');
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect;