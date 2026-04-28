import { v4 as uuidv4 } from 'uuid';
export interface DomainEvent {
  id: string;
  type: string;
  timestamp: Date;
  correlationId?: string;
  source?: string;
}

export abstract class BaseEvent implements DomainEvent {
  id: string;
  type: string;
  timestamp: Date;
  correlationId?: string;
  source?: string;
  constructor(type: string, correlationId?: string, source?: string) {
    this.id = uuidv4();
    this.type = type;
    this.timestamp = new Date();
    this.correlationId = correlationId;
    this.source = source;
  }
}
