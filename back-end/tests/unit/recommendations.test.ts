import { recommendationService } from '../../src/services/recommendationsService';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe('Testing recommendationService', () => {
  it('Should create a valid recommendation', async () => {
    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementationOnce((): any => {});

    const newRecommendation = {
      name: 'test',
      youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };

    await recommendationService.insert(newRecommendation);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it('Should not create an invalid recommendation', async () => {
    const newRecommendation = {
      name: 'test',
      youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    };

    jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => {
        return {
          name: 'test',
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        };
      });

    const promise = recommendationService.insert(newRecommendation);

    expect(promise).rejects.toEqual({
      type: 'conflict',
      message: 'Recommendations names must be unique',
    });
  });

  it('Should upvote a recommendation with valid id', async () => {
    const id = 1;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: 'test 1',
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          score: 1,
        };
      });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(id);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it('Should not upvote a recommendation with invalid id', async () => {
    const id = 999;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.upvote(id);

    expect(promise).rejects.toEqual({
      message: '',
      type: 'not_found',
    });
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it('Should downvote and keep a recommendation with valid id and score > -5', async () => {
    const id = 1;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: 'test 1',
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          score: -4,
        };
      });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: 'test 1',
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          score: -5,
        };
      });

    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalled();
  });

  it('Should downvote and delete a recommendation with valid id and score = -5', async () => {
    const id = 1;

    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: 'test 2',
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          score: -5,
        };
      });

    jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          name: 'test 2',
          youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          score: -6,
        };
      });

    jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(id);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  it('Should get all recommendations from repository', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {});

    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('Should get the top x amount of recommendations', async () => {
    jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockImplementationOnce((): any => {});

    const x = 10;

    await recommendationService.getTop(x);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
  });

  it('Should get random recommendations when there are recommendations registered and random returns > 0.7', async () => {
    jest.spyOn(Math, 'random').mockImplementationOnce((): any => 0.8);

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        return [
          {
            id: 1,
            name: 'test random',
            youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            score: 5,
          },
        ];
      });

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('Should get random recommendations when there are recommendations registered and random returns < 0.7', async () => {
    jest.spyOn(Math, 'random').mockImplementationOnce((): any => 0.6);

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {
        return [
          {
            id: 1,
            name: 'test random',
            youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            score: 5,
          },
        ];
      });

    await recommendationService.getRandom();

    expect(recommendationRepository.findAll).toBeCalled();
  });

  it('Should return error if there are no recommendations registered', async () => {
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementation((): any => {
        return [];
      });

    const promise = recommendationService.getRandom();
    expect(promise).rejects.toEqual({
      message: '',
      type: 'not_found',
    });
  });
});
