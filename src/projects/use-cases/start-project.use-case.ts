import { Inject } from '@nestjs/common';
import { StartProjectDto } from '../dto/start-project.dto';
import { IProjectRepository } from '../project.repository';

export class StartProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  async execute(id: string, startProjectDto: StartProjectDto) {
    const project = await this.projectRepo.findById(id);

    project.start(startProjectDto.started_at);

    await this.projectRepo.update(project);

    return project;
  }
}
