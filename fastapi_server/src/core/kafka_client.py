import time
import json
from kafka import KafkaProducer, KafkaConsumer
from threading import Thread

class KafkaClient:
    def __init__(self, bootstrap_servers='10.2.1.15:9092', group_id='fastapi-video-processor'):
        self.bootstrap_servers = bootstrap_servers
        self.group_id = group_id
        self.producer = None
        self.consumer = None

    def start_producer(self):
        self.producer = KafkaProducer(
            bootstrap_servers=self.bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        print("Producer started!")

    def send_message(self, topic, message):
        if not self.producer:
            raise Exception("Producer not started. Call start_producer() first.")
        self.producer.send(topic, value=message)
        self.producer.flush()
        print(f'Sent: {message}')

    def close_producer(self):
        if self.producer:
            self.producer.close(timeout=1)
            print("Closed Kafka producer")

    def start_consumer(self, topic, on_message):
        self.consumer = KafkaConsumer(
            topic,
            bootstrap_servers=self.bootstrap_servers,
            auto_offset_reset='latest',
            group_id=self.group_id,
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )
        self.consumer_thread = Thread(target=self._consume_messages, args=(on_message,))
        self.consumer_thread.start()
        print("Consumer started!")

    def _consume_messages(self, on_message):
        if not self.consumer:
            raise Exception("Consumer not started. Call start_consumer() first.")
        
        for message in self.consumer:
            on_message(message.value)

    def close_consumer(self):
        if self.consumer:
            self.consumer_thread.join(timeout=5)
            self.consumer.close()
            print("Closed Kafka consumer")

kafkaClient = KafkaClient()

if __name__ == "__main__":
    def handle_message(message):
        print(f'Received: {message}')

    kafka_client = KafkaClient()

    # Start the producer and send messages
    kafka_client.start_producer()
    for i in range(10):
        kafka_client.send_message("process-video-complete",{'number': i})
        print("Sent messaged!")
        time.sleep(1)
    kafka_client.close_producer()

    # # Start the consumer and handle incoming messages
    # kafka_client.start_consumer(handle_message)

    # # Allow some time for messages to be consumed
    # time.sleep(15)
    # kafka_client.close_consumer()
