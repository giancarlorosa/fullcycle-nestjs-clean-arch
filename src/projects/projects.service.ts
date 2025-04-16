import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    const project = new Project(createProjectDto);

    if (createProjectDto.started_at) {
      project.status = ProjectStatus.Active;
    }

    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find();
  }

  findOne(id: string) {
    return this.projectRepo.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepo.findOneOrFail({ where: { id } });

    updateProjectDto.name && (project.name = updateProjectDto.name);
    updateProjectDto.description &&
      (project.description = updateProjectDto.description);

    if (updateProjectDto.started_at) {
      if (project.status === ProjectStatus.Active) {
        throw new Error('Cannot start an activated project');
      }

      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot start a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot start a cancelled project');
      }

      project.started_at = updateProjectDto.started_at;
      project.status = ProjectStatus.Active;
    }

    if (updateProjectDto.cancelled_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot cancel a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot cancel a cancelled project');
      }

      if (
        project.started_at &&
        updateProjectDto.cancelled_at < project.started_at
      ) {
        throw new Error('Cannot cancel a project before it started');
      }

      project.cancelled_at = updateProjectDto.cancelled_at;
      project.status = ProjectStatus.Cancelled;
    }

    if (updateProjectDto.finished_at) {
      if (project.status === ProjectStatus.Completed) {
        throw new Error('Cannot finish a completed project');
      }

      if (project.status === ProjectStatus.Cancelled) {
        throw new Error('Cannot finish a cancelled project');
      }

      if (
        project.started_at &&
        updateProjectDto.finished_at < project.started_at
      ) {
        throw new Error('Cannot finish a project before it started');
      }

      project.finished_at = updateProjectDto.finished_at;
      project.status = ProjectStatus.Completed;
    }

    return this.projectRepo.save(project);
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
