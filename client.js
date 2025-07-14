const { Kafka } = require('kafkajs');

exports.kafka = new Kafka({
    clientId: 'kafka-admin',
    brokers: ['localhost:9092'],
    connectionTimeout: 3000,
    requestTimeout: 25000,
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});