require('dotenv').config();

async function testMoodApi() {
    try {
        // First, let's create a test user in MongoDB directly
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();
        
        // Clear test data
        await db.collection('users').deleteMany({ email: 'test@example.com' });
        await db.collection('moods').deleteMany({ });
        
        // Insert test user
        const userResult = await db.collection('users').insertOne({
            email: 'test@example.com',
            username: 'testuser',
            firebase_uid: 'firebase_test_uid_123',
            coupleId: null,
            theme_preference: 'soft_pink'
        });
        
        console.log('Test user created:', userResult.insertedId.toString());
        
        // Test getting mood (should be null initially)
        const getResponse = await fetch(`http://localhost:5000/api/mood/my-mood/firebase_test_uid_123`);
        const getData = await getResponse.json();
        console.log('Get mood response (initial):', getData);
        
        // Test setting mood
        const setResponse = await fetch(`http://localhost:5000/api/mood/set`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firebaseUid: 'firebase_test_uid_123',
                mood: '😊',
                note: 'Test mood note'
            })
        });
        
        const setData = await setResponse.json();
        console.log('Set mood response:', setData);
        
        // Test getting mood after setting
        const getResponse2 = await fetch(`http://localhost:5000/api/mood/my-mood/firebase_test_uid_123`);
        const getData2 = await getResponse2.json();
        console.log('Get mood response (after set):', getData2);
        
        // Test admin endpoint
        const adminResponse = await fetch(`http://localhost:5000/api/mood/admin/all`);
        const adminData = await adminResponse.json();
        console.log('Admin moods response:', adminData);
        
        await client.close();
        console.log('Test completed successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

testMoodApi();