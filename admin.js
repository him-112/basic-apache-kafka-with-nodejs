const { kafka } = require('./client');

async function init() {
    const admin = kafka.admin();
    console.log('Connecting to Kafka');
    await admin.connect();
    console.log("admin connected successfully");

    const topicName = 'rider-updates';
    console.log(`Checking if topic [${topicName}] exists...`);
    
    try {
        const existingTopics = await admin.listTopics();
        
        if (existingTopics.includes(topicName)) {
            console.log(`✓ Topic [${topicName}] already exists, skipping creation`);
        } else {
            console.log(`Creating topic [${topicName}]...`);
            await admin.createTopics({
                topics: [{
                    topic: topicName,
                    numPartitions: 2,
                }]
            });
            console.log(`✓ Topic [${topicName}] created successfully`);
        }
    } catch (error) {
        console.error("Error with topic operations:", error.message);
        throw error;
    }
    
    console.log("Disconnecting admin..");
    await admin.disconnect();
}

init().catch(console.error);