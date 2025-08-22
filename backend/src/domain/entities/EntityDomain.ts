import { randomUUID, UUID } from "crypto";

export abstract class EntityDomain {
    constructor(
        private uuidHash: UUID = randomUUID(),
        private createdAt: Date = new Date(),
        private updatedAt: Date = new Date()
    ){}

    /**
     * Getter $uuidHash
     * @return {UUID }
     */
	public get $uuidHash(): UUID  {
		return this.uuidHash;
	}

    /**
     * Getter $createdAt
     * @return {Date }
     */
	public get $createdAt(): Date  {
		return this.createdAt;
	}

    /**
     * Getter $updatedAt
     * @return {Date }
     */
	public get $updatedAt(): Date  {
		return this.updatedAt;
	}

    /**
     * Setter $uuidHash
     * @param {UUID } value
     */
	public set $uuidHash(value: UUID ) {
		this.uuidHash = value;
	}

    /**
     * Setter $createdAt
     * @param {Date } value
     */
	public set $createdAt(value: Date ) {
		this.createdAt = value;
	}

    /**
     * Setter $updatedAt
     * @param {Date } value
     */
	public set $updatedAt(value: Date ) {
		this.updatedAt = value;
	}
    
}