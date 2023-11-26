import { Chat, Message } from 'whatsapp-web.js';

import { HandlerOpts } from '../types/handlers';
import { ZapAgent } from '../openai/agent';


export abstract class BaseHandler {
  protected command: string | null = null;

  protected agent: ZapAgent | null = null;

  name: string = 'BASE';

  constructor(
    { agent = null, command = null }: HandlerOpts = {
      agent: null,
      command: null,
    }
  ) {
    this.agent = agent ?? null;

    const isCommandString = typeof command === 'string';
    if (isCommandString) {
      this.command = command;
      this.name = command ?? this.name;
    }
  }

  protected matchCommand(msg: Message): boolean {
    if (!this.command) return true;

    const isCommandString = typeof this.command === 'string';
    return isCommandString ? msg.body.startsWith(this.command) : false;
  }

  abstract shouldExecute(msg: Message): boolean;

  async answer(chat: Chat, msg: string): Promise<boolean | null> {
    return null;
  }

  async handle(chat: Chat, msg: Message): Promise<boolean | null> {
    return null;
  }

  async execute(message: Message): Promise<boolean> {
    const content =
      message.body && this.command
        ? message.body.replace(this.command, '').trim()
        : message.body;

    const chat = await message.getChat();

    let response: boolean | null = null;
    response ??= await this.handle(chat, message);
    response ??= await this.answer(chat, content);

    if (response === null) {
      await chat.sendMessage('No response, unexpected error');
      return false;
    }

    return response;
  }
}
