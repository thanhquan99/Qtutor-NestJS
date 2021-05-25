import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  getManager,
  ILike,
  Equal,
  MoreThan,
  MoreThanOrEqual,
  Not,
  LessThan,
  LessThanOrEqual,
  Any,
} from 'typeorm';

@Injectable()
export abstract class BaseServiceCRUD<T> {
  private repository;
  private entity;
  private modelName: string;

  constructor(repository, entity, modelName: string) {
    this.repository = repository;
    this.entity = entity;
    this.modelName = modelName;
  }

  async getMany(query): Promise<{ results: any; total: number }> {
    const { relationsWith, filterByFields, perPage, page, orderBy } =
      await this.modifyQuery(query);

    const [results, total] = await getManager()
      .findAndCount(this.entity, {
        relations: relationsWith,
        where: filterByFields,
        order: orderBy,
        take: perPage,
        skip: (page - 1) * perPage,
      })
      .catch((err) => {
        throw new InternalServerErrorException(`Failed due to ${err}`);
      });

    return {
      results,
      total,
    };
  }

  async getOne(id: number): Promise<T> {
    const base = await this.repository.findOne({ id });
    if (!base) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return base;
  }

  async createOne(createDto) {
    const base = this.entity.create(createDto);
    return base.save();
  }

  async updateOne(id: number, updateDto) {
    const base = await this.repository.findOne({ id });
    if (!base) {
      throw new NotFoundException(`${this.modelName} not found`);
    }
    return await this.repository.save({ id, ...updateDto });
  }

  async deleteOne(id: number): Promise<void | { message: string }> {
    await this.repository.delete({
      id,
    });
    return { message: 'delete success' };
  }

  async modifyQuery(query) {
    const { filter, relations, perPage = 10, page = 1, orderBy = {} } = query;
    const filterByFields = {};
    let relationsWith = [];

    if (filter) {
      for (const field in filter) {
        const operator = Object.keys(filter[field])[0];
        const value = filter[field][operator];
        switch (operator) {
          case 'equal':
            filterByFields[field] = Equal(value);
            break;
          case 'notequal':
            filterByFields[field] = Not(value);
            break;
          case 'gt':
            filterByFields[field] = MoreThan(value);
            break;
          case 'gte':
            filterByFields[field] = MoreThanOrEqual(value);
            break;
          case 'lt':
            filterByFields[field] = LessThan(value);
            break;
          case 'lte':
            filterByFields[field] = LessThanOrEqual(value);
            break;
          case 'in':
            filterByFields[field] = Any(value);
            break;
          case 'like':
            filterByFields[field] = ILike(`%${value}%`);
            break;
          default:
            break;
        }
      }
    }

    if (relations) {
      relationsWith = relations.split(',');
    }

    return { filterByFields, relationsWith, perPage, page, orderBy };
  }
}
