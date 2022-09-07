import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'blind_structure_meta' })
export class BlindStructureMeta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  static create(name: string) {
    const meta = new BlindStructureMeta();
    meta.name = name;
    return meta;
  }
}
