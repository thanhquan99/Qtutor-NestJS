import { ModelFields } from './../db/models/BaseModel';
import { ROLE } from 'src/constant';
import { Subject, City, Role, User } from 'src/db/models';
import tutorsData from './tutor_data.json';
import * as _ from 'lodash';

function nonAccentVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  str = str.replace(/\u02C6|\u0306|\u031B/g, '');
  return str;
}

const processData = async () => {
  const prices = [100000, 120000, 150000, 200000];
  const sessionsOfWeeks = [1, 2, 3];
  const subjects = await Subject.query();
  const cities = await City.query();
  const genders = [true, false];
  const customerRole = await Role.query().findOne({ name: ROLE.CUSTOMER });
  const tutorDescriptions = [
    'Chuyên dạy luyện thi vào lớp 10',
    'Có kinh nghiệm trợ giảng tại trường bách khoa',
    'Có kinh nghiệm trợ giảng cho các thầy cô tại trung tâm',
    'Có nhiều năm kinh nghiệm làm gia sư',
    'Chuyên dạy luyện thi đại học',
  ];
  const yearsExperiences = [1, 2, 3, 4, 5];

  const tutorSubjects = subjects.map((subject) => ({
    subjectId: subject.id,
    sessionsOfWeek: _.sample(sessionsOfWeeks),
    price: _.sample(prices),
  }));

  const tutors = tutorsData.map((tutor) => ({
    ...tutor,
    name: nonAccentVietnamese(tutor.name.replace(/ /g, '').toLowerCase()),
  }));

  const insertData = tutors.map(
    (tutor, index): ModelFields<User> => ({
      email: tutor.name + index + '@gmail.com',
      password: '$2b$10$leL65eC89pj8mWzejdSVbeEwpwnM9ctSKimMKWhnBeZuN5c9hySya',
      isActive: true,
      roleId: customerRole.id,
      profile: {
        name: tutorsData[index].name,
        avatar: tutor.avatar,
        isMale: _.sample(genders),
        cityId: _.sample(cities).id,
      },
      tutor: {
        description: _.sample(tutorDescriptions),
        minimumSalary: _.sample(prices),
        yearsExperience: _.sample(yearsExperiences),
        tutorSubjects: _.sampleSize(tutorSubjects, _.random(1, 5)),
      },
    }),
  );

  await User.query().insertGraph(insertData);
};

export default processData;
