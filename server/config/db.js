const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Maximum number of connections in the pool.
            // Allows concurrent requests to reuse existing connections
            // instead of opening a new TCP socket for each request.
            maxPoolSize: 10,

            // How long the driver will wait to find an available server
            // before throwing a timeout error (5 seconds).
            serverSelectionTimeoutMS: 5000,

            // How long a socket stays open with no activity before
            // the driver closes it (45 seconds).
            socketTimeoutMS: 45000,

            // Force IPv4. Avoids slow IPv6 DNS resolution which can add
            // hundreds of milliseconds on some cloud environments.
            family: 4,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
