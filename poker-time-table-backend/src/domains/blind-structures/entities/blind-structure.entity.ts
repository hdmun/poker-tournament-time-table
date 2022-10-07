import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'blind_structure' })
export class BlindStructure {
  @PrimaryColumn({ name: 'meta_id' })
  metaId: number;

  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column()
  level: number;

  @Column({ name: 'ante' })
  ante: number;

  @Column({ name: 'small_blind' })
  smallBlind: number;

  @Column({ name: 'big_blind' })
  bigBlind: number;

  @Column()
  minute: number;

  static create(
    metaId: number,
    id: number,
    level: number,
    ante: number,
    smallBlind: number,
    bigBlind: number,
    minute: number,
  ): BlindStructure {
    const structure = new BlindStructure();
    structure.metaId = metaId;
    structure.id = id;
    structure.level = level;
    structure.ante = ante;
    structure.smallBlind = smallBlind;
    structure.bigBlind = bigBlind;
    structure.minute = minute;
    return structure;
  }
}
