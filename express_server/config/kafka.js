import { Kafka, Partitioners } from "kafkajs";

// Kafka configuration
const kafka = new Kafka({
	clientId: "express-server",
	brokers: ["localhost:9092"],
});

const producer = kafka.producer({
	createPartitioner: Partitioners.DefaultPartitioner,
});

const consumer = kafka.consumer({ groupId: "video-processor" });

export const runConsumer = async (topic, callback) => {
	await consumer.connect();
	await consumer.subscribe({ topics: [topic], fromBeginning: true });
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const messageValue = message.value.toString();
			console.log("Received message from Kafka:");
			console.log({
				topic,
				partition,
				offset: message.offset,
				value: messageValue,
			});
			callback(messageValue);
		},
	});
};

export const connectProducer = async () => {
	await producer.connect();
};

export const sendMessage = async (topic, data) => {
	try {
		const payload = JSON.stringify(data);
		await producer.send({
			topic,
			messages: [{ value: payload }],
		});
		console.log("Message sent:", data);
	} catch (err) {
		console.error("Error sending message:", err);
	}
};
