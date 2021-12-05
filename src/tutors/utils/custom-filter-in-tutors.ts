import _ from 'lodash';
import { QueryBuilder } from 'objection';
import { knex, Profile, Tutor, TutorSubject } from 'src/db/models';

const customFilterInTutors = (
  builder: QueryBuilder<Tutor>,
  customFilter = {
    name: undefined,
    isMale: undefined,
    cityId: undefined,
    subjectId: undefined,
  },
): void => {
  const { name, isMale, cityId, subjectId } = customFilter;

  if (name) {
    const profileBuilder = Profile.query()
      .select('userId')
      .whereRaw(`name ilike $$%${name}%$$`);
    builder.whereIn('userId', knex.raw(profileBuilder.toKnexQuery().toQuery()));
  }

  if (!_.isNil(isMale)) {
    const profileBuilder = Profile.query().select('userId').where({ isMale });
    builder.whereIn('userId', knex.raw(profileBuilder.toKnexQuery().toQuery()));
  }

  if (cityId) {
    const profileBuilder = Profile.query().select('userId').where({ cityId });
    builder.whereIn('userId', knex.raw(profileBuilder.toKnexQuery().toQuery()));
  }

  if (subjectId) {
    const tutorSubjectBuilder = TutorSubject.query()
      .select('tutorId')
      .where({ subjectId });
    builder.whereIn(
      'id',
      knex.raw(tutorSubjectBuilder.toKnexQuery().toQuery()),
    );
  }
  return;
};

export { customFilterInTutors };
