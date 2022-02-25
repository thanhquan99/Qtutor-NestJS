import _ from 'lodash';
import { QueryBuilder } from 'objection';
import { Profile, Tutor, TutorSubject, TutorView } from 'src/db/models';

const customFilterInTutors = (
  builder: QueryBuilder<Tutor> | QueryBuilder<TutorView>,
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
    builder.whereIn('userId', profileBuilder);
  }

  if (!_.isNil(isMale)) {
    const profileBuilder = Profile.query().select('userId').where({ isMale });
    builder.whereIn('userId', profileBuilder);
  }

  if (cityId) {
    const profileBuilder = Profile.query().select('userId').where({ cityId });
    builder.whereIn('userId', profileBuilder);
  }

  if (subjectId) {
    const tutorSubjectBuilder = TutorSubject.query()
      .select('tutorId')
      .where({ subjectId });
    builder.whereIn('id', tutorSubjectBuilder);
  }
  return;
};

export { customFilterInTutors };
