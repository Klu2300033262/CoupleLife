require('dotenv').config();

async function testMongoConnection() {
    try {
        const { MongoClient } = require('mongodb');
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/couplelife_os';
        const client = new MongoClient(uri);
        
        await client.connect();
        console.log('✅ MongoDB Connected Successfully');
        
        const db = client.db();
        
        // Test inserting a document
        const result = await db.collection('test').insertOne({
            test: 'MongoDB connection works',
            timestamp: new Date()
        });
        
        console.log('✅ Test document inserted:', result.insertedId);
        
        // Test reading the document
        const doc = await db.collection('test').findOne({ _id: result.insertedId });
        console.log('✅ Test document retrieved:', doc);
        
        // Clean up
        await db.collection('test').deleteMany({});
        console.log('✅ Test document cleaned up');
        
        await client.close();
        console.log('✅ MongoDB connection closed');
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        return false;
    }
}

testMongoConnection().then(success => {
    process.exit(success ? 0 : 1);
});