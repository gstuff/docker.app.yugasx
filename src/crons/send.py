#!/usr/bin/env python
import pika

credentials = pika.PlainCredentials('guest', 'iloveguy!')
parameters = pika.ConnectionParameters('10.79.55.12', 5672, '/', credentials)
queue_name = 'hello'

connection = pika.BlockingConnection(parameters)
channel = connection.channel()


try:
    channel.queue_declare(queue=queue_name, durable=True, passive=True)
    print("Queue '{}' exists and is durable.".format(queue_name))
    channel.basic_publish(exchange='',
                      routing_key='ar3.asx',
                      body='Hello World! FROM PYTHON')
    print(" [x] Sent 'Hello World! FROM PYTHON'")
except pika.exceptions.ChannelClosedByBroker as err:
    if err.reply_code == 404:
        print("Queue '{}' does not exist.".format(queue_name))
    else:
        raise
finally:
    connection.close()

# channel.queue_declare(queue='hello')

# channel.basic_publish(exchange='',
#                       routing_key='hello',
#                       body='Hello World!')
# print(" [x] Sent 'Hello World!'")

#connection.close()
