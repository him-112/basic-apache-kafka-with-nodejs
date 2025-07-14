const { kafka } = require('./client');
const { Partitioners } = require('kafkajs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function init() {
    const producer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner
    });

    console.log("Connecting Producer..");
    await producer.connect();
    console.log("Producer connected successfully");

    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", async function(line) {
        const [riderName, location] = line.split(" ");
        
        if (!riderName || !location) {
            console.log("Please provide both rider name and location (e.g., 'Himanshu North')");
            rl.prompt();
            return;
        }

        try {
            await producer.send({
                topic: "rider-updates",
                messages: [  // Fixed: was "message", should be "messages"
                    {
                        partition: location.toLowerCase() === "north" ? 0 : 1,
                        key: "location-update",
                        value: JSON.stringify({
                            riderName,
                            location,
                        })
                    }
                ]
            });
            console.log(`✓ Message sent: ${riderName} is in ${location}`);
        } catch (error) {
            console.error("Error sending message:", error.message);
        }
        
        rl.prompt();
    }).on("close", async function() {
        console.log("Producer disconnected");
        await producer.disconnect();
        // process.exit(0);
    });
}

init().catch(console.error);