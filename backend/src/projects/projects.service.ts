import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) { }

    async create(createData: Partial<Project>): Promise<Project> {
        const project = this.projectRepository.create(createData);
        return await this.projectRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return await this.projectRepository.find();
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id } });
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async update(id: string, updateData: Partial<Project>): Promise<Project> {
        const project = await this.findOne(id);
        this.projectRepository.merge(project, updateData);
        return await this.projectRepository.save(project);
    }

    async remove(id: string): Promise<void> {
        const project = await this.findOne(id);
        await this.projectRepository.remove(project);
    }
}
