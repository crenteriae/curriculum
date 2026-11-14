import { Commands } from './types';
import type { CommandHandler } from './types';

export const help: CommandHandler = () => Object.values(Commands).join('\n');
