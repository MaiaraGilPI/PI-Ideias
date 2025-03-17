import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('formulario_ideias')
export class FormularioIdeias {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column()
  titulo_projeto: string;

  @Column('text')
  descricao_ideia: string;

  @Column({ nullable: true })
  como_conheceu?: string;

  @Column({ default: false })
  participar_clube: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  data_envio: Date;

  @Column({ default: false })
  foi_apagado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  data_apagado?: Date;
}
