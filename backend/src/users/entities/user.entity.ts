import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    jobTitle: string;

    @Column({ nullable: true })
    username: string;

    @Column({ default: 'light' })
    theme: string;

    @Column({ default: 'Blue' })
    color: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
