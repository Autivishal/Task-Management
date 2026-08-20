import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsString()
    priority?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: Date;

    @IsOptional()
    @IsString()
    assignee?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    projectId?: string;

    @IsOptional()
    @IsString()
    parentTaskId?: string;
}
