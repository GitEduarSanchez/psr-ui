export interface Message {
  from: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
  fileName?: string;
}
