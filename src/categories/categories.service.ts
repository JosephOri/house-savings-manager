import { Injectable, OnModuleInit } from '@nestjs/common';
import { AbstractCrudService, Category } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@repo/shared';
@Injectable()
export class CategoriesService
  extends AbstractCrudService<Category>
  implements OnModuleInit
{
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }
  async onModuleInit() {
    await this.seedDefaultCategories();
  }

  async findAllOfUser(userId: string) {
    return this.categoryRepository.find({
      where: [{ userId: IsNull() }, { userId: userId }],
      order: { value: 'ASC' },
    });
  }

  private async seedDefaultCategories() {
    for (const name in EXPENSE_CATEGORIES) {
      const exists = await this.categoryRepository.findOne({
        where: { value: name, userId: IsNull(), type: 'expense' },
      });
      if (!exists) {
        await this.categoryRepository.save({
          value: name,
          userId: null,
          type: 'expense',
        });
      }
    }

    for (const name in INCOME_CATEGORIES) {
      const exists = await this.categoryRepository.findOne({
        where: { value: name, userId: IsNull(), type: 'income' },
      });
      if (!exists) {
        await this.categoryRepository.save({
          value: name,
          userId: null,
          type: 'income',
        });
      }
    }
  }
}
