import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from '../entities';

@Injectable()
export abstract class AbstractCrudService<T extends BaseEntity> {
  protected constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findOne(id: T['id']): Promise<T> {
    const options: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>;
    const entity = await this.repository.findOneBy(options);
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return entity;
  }

  async update(id: T['id'], data: DeepPartial<T>): Promise<T> {
    await this.findOne(id);

    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: T['id']): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
  }
}
