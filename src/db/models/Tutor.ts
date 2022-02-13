import { QueryBuilder } from 'objection';
import {
  Subject,
  TutorSubject,
  Profile,
  Student,
  knex,
  TutorRating,
} from 'src/db/models';
import { TutorStudentStatus } from '../../constant';
import BaseModel, { ModelFields } from './BaseModel';
import Schedule from './Schedule';
import TeachingPrice from './TeachingPrice';
import TutorStudent from './TutorStudent';

export default class Tutor extends BaseModel {
  description: string;
  isPublished: boolean;
  minimumSalary: number;
  isSpecial: boolean;
  yearsExperience: number;

  userId: string;

  profile?: ModelFields<Profile>;
  subjects?: ModelFields<Subject>[];
  tutorSubjects?: ModelFields<TutorSubject>[];

  static get tableName() {
    return 'tutor';
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      subjects: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Subject,
        join: {
          from: 'tutor.id',
          through: {
            from: 'tutor_subject.tutorId',
            to: 'tutor_subject.subjectId',
          },
          to: 'subject.id',
        },
      },
      tutorSubjects: {
        relation: BaseModel.HasManyRelation,
        modelClass: TutorSubject,
        join: {
          from: 'tutor.id',
          to: 'tutor_subject.tutorId',
        },
      },
      profile: {
        relation: BaseModel.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'tutor.userId',
          to: 'profile.userId',
        },
      },
      teachingPrices: {
        relation: BaseModel.HasManyRelation,
        modelClass: TeachingPrice,
        join: {
          from: 'tutor.id',
          to: 'teaching_price.tutorId',
        },
      },
      ratings: {
        relation: BaseModel.HasManyRelation,
        modelClass: TutorRating,
        join: {
          from: 'tutor.id',
          to: 'tutor_rating.tutorId',
        },
      },
      schedules: {
        relation: BaseModel.HasManyRelation,
        modelClass: Schedule,
        join: {
          from: 'tutor.userId',
          to: 'schedule.userId',
        },
      },
      teachings: {
        relation: BaseModel.HasManyRelation,
        modelClass: TutorStudent,
        join: {
          from: 'tutor.id',
          to: 'tutor_student.tutorId',
        },
      },
    };
  }

  static modifiers = {
    defaultSelect(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'description',
        'minimumSalary',
        'isSpecial',
        'userId',
        'yearsExperience',
      ).withGraphFetched('[profile(defaultSelect), subjects(defaultSelect)]');
    },
    getTotalStudents(qb: QueryBuilder<BaseModel>) {
      const tutorStudentBuilder = TutorStudent.query()
        .select(knex.raw('DISTINCT("studentId")'))
        .whereRaw('"tutorId" = "tutor".id')
        .whereIn('status', [
          TutorStudentStatus.ACCEPTED,
          TutorStudentStatus.ARCHIVED,
        ]);
      const totalStudentsBuilder = Student.query()
        .select(knex.raw('count(id)'))
        .whereIn('id', tutorStudentBuilder);

      qb.select(
        knex.raw(
          `(${totalStudentsBuilder
            .toKnexQuery()
            .toQuery()}) as "totalStudents"`,
        ),
      );
    },
    selectInGetOne(qb: QueryBuilder<BaseModel>) {
      qb.modify([
        'defaultSelect',
        'getTotalStudents',
        'getTotalCourses',
        'getTotalRatings',
        'getAverageRating',
      ]).withGraphFetched(
        '[tutorSubjects(defaultSelect), schedules(getFreeTime)]',
      );
    },
    getTotalCourses(qb: QueryBuilder<BaseModel>) {
      const totalCourses = TutorStudent.query()
        .select(knex.raw('count(id)'))
        .whereRaw('"tutorId" = "tutor".id')
        .whereIn('status', [
          TutorStudentStatus.ACCEPTED,
          TutorStudentStatus.ARCHIVED,
        ]);

      qb.select(
        knex.raw(`(${totalCourses.toKnexQuery().toQuery()}) as "totalCourses"`),
      );
    },
    selectInTutorStudent(qb: QueryBuilder<BaseModel>) {
      qb.select('id', 'userId').withGraphFetched('[profile(defaultSelect)]');
    },
    selectInSuggestion(qb: QueryBuilder<BaseModel>) {
      qb.select(
        'id',
        'description',
        'minimumSalary',
        'isSpecial',
      ).withGraphFetched('profile(defaultSelect)');
    },
    getTotalRatings(qb: QueryBuilder<BaseModel>) {
      const totalRatingBuilder = TutorRating.query()
        .select(knex.raw('count(id)'))
        .whereRaw('"tutorId" = "tutor".id');

      qb.select(
        knex.raw(
          `(${totalRatingBuilder.toKnexQuery().toQuery()}) as "totalRatings"`,
        ),
      );
    },
    getAverageRating(qb: QueryBuilder<BaseModel>) {
      const totalRatingBuilder = TutorRating.query()
        .select(knex.raw('COALESCE(AVG(rating)::numeric(10,1), 0)'))
        .whereRaw('"tutorId" = "tutor".id');

      qb.select(
        knex.raw(
          `(${totalRatingBuilder.toKnexQuery().toQuery()}) as "averageRating"`,
        ),
      );
    },
    selectInGetMe(qb: QueryBuilder<BaseModel>) {
      qb.modify(['defaultSelect']).withGraphFetched(
        '[tutorSubjects(defaultSelect), teachings(distinctSubject)]',
      );
    },
  };
}
