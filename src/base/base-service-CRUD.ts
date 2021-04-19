import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryParams } from 'src/base/dto/query-params.dto';

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

  async getMany(query: QueryParams): Promise<{ results: T[]; total: number }> {
    const builder = this.repository.createQueryBuilder(this.modelName);
    return this.queryBuilder(builder, query, this.modelName);
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

  async queryBuilder(builder, query: QueryParams, modelName) {
    const { limit, filter, offset, orderBy } = query;

    if (filter) {
      const filterByFields = JSON.parse(filter);
      console.log(filterByFields);
      for (const field in filterByFields) {
        const operator = Object.keys(filterByFields[field])[0];
        const value = filterByFields[field][operator];
        switch (operator) {
          case 'equal':
            builder.andWhere(`"${modelName}"."${field}" = '${value}'`);
            break;
          case 'notequal':
            builder.andWhere(`"${modelName}"."${field}" != '${value}'`);
            break;
          case 'gt':
            builder.andWhere(`"${modelName}"."${field}" > '${value}'`);
            break;
          case 'gte':
            builder.andWhere(`"${modelName}"."${field}" >= '${value}'`);
            break;
          case 'lt':
            builder.andWhere(`"${modelName}"."${field}" < '${value}'`);
            break;
          case 'lte':
            builder.andWhere(`"${modelName}"."${field}" <= '${value}'`);
            break;
          case 'in':
            builder.andWhere(
              `"${modelName}"."${field}" = ANY('{${value.map(
                (e) => `${e}`,
              )}}')`,
            );
            break;
          case 'like':
            builder.andWhere(`"${modelName}"."${field}" LIKE '%${value}%'`);
            break;
          default:
            break;
        }
      }
    }

    const total = await builder.getCount();

    if (limit) {
      builder.limit(limit);
    }

    if (offset) {
      builder.offset(offset);
    }

    if (orderBy) {
      const orderByFields = orderBy.split(',');

      for (let field of orderByFields) {
        let orderDirection;

        if (field[0] === '-') {
          field = field.slice(1);
          orderDirection = 'DESC';
        } else {
          orderDirection = 'ASC';
        }

        builder.orderBy(`${this.modelName}.${field}`, orderDirection);
      }
    }

    const results = await builder.getMany();

    return {
      total,
      results,
    };
  }
}
