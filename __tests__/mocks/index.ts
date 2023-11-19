import { mock } from 'bun:test';
import { Chat, Message } from 'whatsapp-web.js';
import { Agent } from '../../src/openai/agent';

export const mockAgent = () =>
  ({
    complet: mock(async () => '[MOCKED] GPT response'),
  } as unknown as Agent);

export const mockWppChat = () =>
  ({
    sendMessage: mock(async () => ({} as Message)),
  } as unknown as Chat);

export const mockWppMessage = () =>
  ({
    body: '/gpt.test-mock MOCKED',
    getChat: mock(async () => mockWppChat()),
  } as unknown as Message);
