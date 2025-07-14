# Kafka Rider Updates App

A Node.js application demonstrating Apache Kafka producer and consumer functionality for tracking rider location updates.

## Features

- **Admin Tool**: Creates Kafka topics with proper partitioning
- **Producer**: Sends rider location updates to Kafka topics
- **Consumer**: Consumes and displays rider location messages
- **Partitioning**: Routes messages to different partitions based on location (North/South)

## Prerequisites

- Node.js (v14 or higher)
- Docker (for running Kafka and Zookeeper)
- Yarn or npm

## Installation

### Option 1: Using Docker (Recommended)

1. Start Zookeeper:
```bash
docker run -p 2181:2181 zookeeper
```

2. Start Kafka (in a new terminal):
```bash
docker run -d \
  -p 9092:9092 \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=192.168.1.39:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.39:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  confluentinc/cp-kafka:7.2.1
```

3. Install Node.js dependencies:
```bash
yarn install
# or
npm install
```

4. Update `client.js` with your Kafka broker address if different from `192.168.1.39:9092`

**Note:** Replace `192.168.1.39` with your actual IP address. To find your IP:
- **macOS/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`
- **Docker Desktop**: You can use `localhost` instead of the IP address

### Option 2: Local Kafka Installation

1. Install dependencies:
```bash
yarn install
# or
npm install
```

2. Ensure Kafka is running on `localhost:9092` (or update `client.js` with your broker address)

## Project Structure

```
kafka-app/
├── admin.js          # Topic creation and management
├── producer.js       # Message producer with interactive input
├── consumer.js       # Message consumer with group support
├── client.js         # Kafka client configuration
├── package.json      # Dependencies
└── README.md         # This file
```

## Configuration

Update `client.js` if your Kafka broker is running on a different host:

```javascript
exports.kafka = new Kafka({
    clientId: 'kafka-admin',
    brokers: ['your-kafka-host:9092'], // Update this
    // ... other config
});
```

## Usage

### 1. Create Topics

First, create the required Kafka topic:

```bash
node admin.js
```

Expected output:
```
Connecting to Kafka
admin connected successfully
Checking if topic [rider-updates] exists...
✓ Topic [rider-updates] created successfully
Disconnecting admin..
```

### 2. Start Consumer

Start a consumer to receive messages:

```bash
node consumer.js group-1
```

You can run multiple consumers with different group IDs:
```bash
# Terminal 1
node consumer.js group-1

# Terminal 2  
node consumer.js group-2
```

### 3. Send Messages with Producer

Start the producer in interactive mode:

```bash
node producer.js
```

Then type rider updates in the format: `[RiderName] [Location]`

Examples:
```
> Himanshu North
✓ Message sent: Himanshu is in North

> Sarah South
✓ Message sent: Sarah is in South

> John North
✓ Message sent: John is in North
```

## Message Format

Messages are sent as JSON with the following structure:
```json
{
  "riderName": "Himanshu",
  "location": "North"
}
```

## Partitioning Logic

- **North** locations → Partition 0
- **South** locations → Partition 1
- All other locations → Partition 1 (default)

## Consumer Output

The consumer displays detailed message information:
```
[2025-07-14T07:08:34.935Z] Message received:
  Topic: rider-updates
  Partition: 0
  Key: location-update
  Rider: Himanshu
  Location: North
  Group: group-1
  ----------------------------------------
```

## Troubleshooting

### Common Issues

1. **Topic creation errors**: Usually means the topic already exists
2. **Connection errors**: Check if Kafka is running and accessible
3. **Partitioner warnings**: The app uses LegacyPartitioner to maintain consistent behavior

### Debug Commands

Check if Kafka is running:
```bash
# Check if Kafka port is open
netstat -an | grep 9092

# If using Docker
docker ps | grep kafka
```

### Environment Variables

Set this to suppress partitioner warnings:
```bash
export KAFKAJS_NO_PARTITIONER_WARNING=1
```

### Docker Management

Check running containers:
```bash
docker ps
```

Stop Kafka container:
```bash
docker stop <kafka-container-id>
```

Stop Zookeeper container:
```bash
docker stop <zookeeper-container-id>
```

Remove containers:
```bash
docker rm <container-id>
```

View Kafka logs:
```bash
docker logs <kafka-container-id>
```

## Development

The application uses:
- **KafkaJS v2.2.4** - Kafka client library
- **Node.js readline** - Interactive producer input
- **Legacy Partitioner** - For consistent message distribution

## Examples

### Full Workflow

1. Start consumer:
```bash
node consumer.js riders-group
```

2. In another terminal, start producer:
```bash
node producer.js
```

3. Send some updates:
```
> Alice North
> Bob South
> Charlie North
> Diana South
```

4. Watch messages appear in the consumer terminal

### Multiple Consumers

You can run multiple consumers in the same group for load balancing:

```bash
# Terminal 1
node consumer.js riders-group

# Terminal 2  
node consumer.js riders-group
```

Or different groups to process all messages:
```bash
# Terminal 1
node consumer.js analytics-group

# Terminal 2
node consumer.js logging-group
```

## License

This project is for educational purposes.
