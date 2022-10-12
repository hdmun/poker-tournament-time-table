import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dealer' })
export class Dealer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'register_date' })
  registerDate: Date;

  @Column({ length: 12, unique: true })
  name: string;

  static Create(name: string): Dealer {
    const newDealer = new Dealer();
    newDealer.registerDate = new Date();
    newDealer.name = name;
    return newDealer;
  }
}
