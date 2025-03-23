declare module "amqplib" {
  import { EventEmitter } from "events";

  export interface Connection extends EventEmitter {
    createChannel(): Promise<Channel>;
    close(): Promise<void>;
  }

  export interface Channel extends EventEmitter {
    assertQueue(queue: string, options?: any): Promise<{ queue: string }>;
    sendToQueue(queue: string, content: Buffer, options?: any): boolean;
    consume(
      queue: string,
      callback: (msg: Message | null) => void,
      options?: any
    ): Promise<{ consumerTag: string }>;
    ack(message: Message, allUpTo?: boolean): void;
    nack(message: Message, allUpTo?: boolean, requeue?: boolean): void;
    prefetch(count: number, global?: boolean): Promise<void>;
    close(): Promise<void>;
  }

  export interface Message {
    content: Buffer;
    fields: any;
    properties: any;
  }

  export function connect(url: string): Promise<Connection>;
}
