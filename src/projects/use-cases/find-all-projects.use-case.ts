import { Inject } from '@nestjs/common';
import { IProjectRepository } from '../project.repository';

export class FindAllProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepo: IProjectRepository,
  ) {}

  execute() {
    return this.projectRepo.findAll();
  }
}
