import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE', nullable: true })
    project: Project;

    @Column({ nullable: true })
    projectId: string;

    @ManyToOne(() => Task, task => task.id, { onDelete: 'CASCADE', nullable: true })
    parentTask: Task;

    @Column({ nullable: true })
    parentTaskId: string;

    @Column()
    title: string;

    @Column({ default: 'To Do' })
    status: string; // 'To Do', 'Doing', 'Completed', 'On Hold'

    @Column({ default: 'Medium' })
    priority: string; // 'Low', 'Medium', 'High', 'Urgent'

    @Column({ nullable: true })
    dueDate: Date;

    @Column({ nullable: true })
    assignee: string; // Storing string for simplicity or JSON of the member

    @Column('simple-array', { nullable: true })
    tags: string[]; // e.g. ['Design', 'Development']

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
