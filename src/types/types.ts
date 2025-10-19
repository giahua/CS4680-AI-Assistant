import { ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  customComponent?: ReactNode;
}