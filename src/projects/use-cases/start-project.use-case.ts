import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { Repository } from 'typeorm';
import { StartProjectDto } from '../dto/start-project.dto';

export class StartProjectUseCase {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async execute(id: string, startProjectDto: StartProjectDto) {
    const project = await this.projectRepo.findOneOrFail({ where: { id } });

    project.start(startProjectDto.started_at);

    return this.projectRepo.save(project);
  }
}
