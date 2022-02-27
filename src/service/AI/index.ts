import { ModelFields } from './../../db/models/BaseModel';
import * as rec from 'collaborative-filter';
import { TutorRating, User } from '../../db/models';

export const collaborativeFilter = (
  users: ModelFields<User>[],
  ratings: ModelFields<TutorRating>[],
): { userId: string; recommendationTutorIds: string[] }[] => {
  const transformRatings = {};
  for (const rating of ratings) {
    if (transformRatings[rating.tutorId]) {
      transformRatings[rating.tutorId].push(rating.reviewerId);
    } else {
      transformRatings[rating.tutorId] = [rating.reviewerId];
    }
  }

  const trainData = [];
  for (const user of users) {
    const userRating = [];
    for (const tutorId of Object.keys(transformRatings)) {
      if (transformRatings[tutorId].includes(user.id)) {
        userRating.push(1);
      } else {
        userRating.push(0);
      }
    }
    trainData.push(userRating);
  }

  const updateUser = [];
  users.forEach((user, index) => {
    const indexArr = rec.cFilter(trainData, index);
    if (indexArr?.length) {
      updateUser.push({
        userId: user.id,
        recommendationTutorIds: indexArr.map(
          (e) => Object.keys(transformRatings)[e],
        ),
      });
    }
  });
  console.log(updateUser);
  return updateUser;
};
