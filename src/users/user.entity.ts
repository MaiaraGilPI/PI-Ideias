import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true }) // 📌 Telefone opcional
  telefone?: string;

  @Column({ length: 100 }) // 📌 Campo obrigatório para recuperação (máx. 100 caracteres)
  recuperacao: string;

  @Column({ length: 100 }) // 📌 Dica de recuperação visível ao usuário (máx. 100 caracteres)
  dica_recuperacao: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
