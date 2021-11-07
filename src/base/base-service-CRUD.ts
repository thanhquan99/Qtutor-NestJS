import { QueryBuilder } from 'objection';
import { Injectable, NotFoundException } from '@nestjs/common';
import BaseModel from 'src/db/models/BaseModel';

@Injectable()
export abstract class BaseServiceCRUD<T extends BaseModel> {
  private model;
  private modelName: string;

  constructor(model, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }

  async paginate(
    builder: QueryBuilder<T>,
    query,
  ): Promise<{ results: T[]; total }> {
    const { orderBy, perPage, page } = query;
    const resultsBuilder = builder.clone();
    const totalBuilder = builder.clone().clearSelect().count().first();

    if (orderBy) {
      for (const field in orderBy) {
        resultsBuilder.orderBy(field, orderBy[field]);
      }
    }
    resultsBuilder.limit(perPage).offset(page - 1);

    const [results, { count: total }] = await Promise.all([
      resultsBuilder,
      totalBuilder,
    ]);
    return { results, total };
  }

  async getMany(query): Promise<{ results: T[]; total }> {
    const builder = this.model.queryBuilder(query);
    return await this.paginate(builder, query);
  }

  async getOne(id: string): Promise<T> {
    const tutor = await this.model.query().findById(id);
    if (!tutor) {
      throw new NotFoundException(`${this.modelName} not found`);
    }

    return tutor;
  }

  async createOne(payload) {
    return await this.model.query().insertGraphAndFetch(payload);
  }

  async updateOne(id: string, payload): Promise<T> {
    const tutor = await this.model.query().updateAndFetchById(id, payload);
    if (!tutor) {
      throw new NotFoundException(`${this.modelName} not found`);
    }

    return tutor;
  }

  async deleteOne(id): Promise<{ message: string }> {
    await this.model.query().deleteById(id);
    return { message: 'Delete successfully' };
  }
}
