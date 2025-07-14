const { kafka } = require("./client");
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({
    groupId: group,
  });

  console.log(`Connecting Consumer with group: ${group}...`);
  await consumer.connect();
  console.log("Consumer connected successfully");

  await consumer.subscribe({
    topic: "rider-updates",
    fromBeginning: true,
  });

  console.log("Subscribed to topic 'rider-updates'");
  console.log("Waiting for messages... (Press Ctrl+C to stop)");

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      try {
        const riderData = JSON.parse(message.value.toString());
        console.log(`
            [${new Date().toISOString()}] Message received:
                Topic: ${topic}
                Partition: ${partition}
                Key: ${message.key}
                Rider: ${riderData.riderName}
                Location: ${riderData.location}
                Group: ${group}
            ----------------------------------------`);
      } catch (error) {
        console.error("Error parsing message:", error.message);
        console.log("Raw message:", message.value.toString());
      }
    },
  });
}

init().catch(console.error);
