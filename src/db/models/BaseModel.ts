import { QueryBuilder } from 'objection';
import { buildFilter } from 'objection-filter';
import { Model } from './config';

export default class BaseModel extends Model {
  count?: string;
  sum?: number;
  min?: number;
  max?: number;
  avg?: number;

  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;

  static queryBuilder<T extends BaseModel>(
    query,
    trx = undefined,
  ): QueryBuilder<T, T[]> {
    const options = {
      operators: {
        $ilike: (property, operand, builder) =>
          builder.whereRaw(`?? ILIKE $$%${operand}%$$`, [property]),
      },
    };

    const builder = buildFilter(this, trx, options).build({
      where: query.filter || {},
    });
    return builder as any as QueryBuilder<T, T[]>;
  }
}

export type ModelFields<T extends Model, K extends Model = Model> = Partial<
  Omit<Partial<T>, keyof Required<K>>
>;
