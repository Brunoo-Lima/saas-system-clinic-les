import { randomUUID, UUID } from 'crypto';

export class EntityDomain {
  constructor(
    private uuidHash: UUID | string= randomUUID(),
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
    private timezone: number = -3
  ) {}

  public getUUIDHash(): UUID | string {
    return this.uuidHash;
  }
  public getTimezone(): number {
    return this.timezone;
  }
  
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setUuidHash(value: UUID | string) {
    this.uuidHash = value;
  }

  public setCreatedAt(value: Date) {
    this.createdAt = value;
  }

  public setUpdatedAt(value: Date) {
    this.updatedAt = value;
  }
}
