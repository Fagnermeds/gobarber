import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'username',
      email: 'test@test.com',
      password: '123456',
    });

    const response = await authenticateUserService.execute({
      email: 'test@test.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able authenticate an user does not exists', async () => {
    await expect(
      authenticateUserService.execute({
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate an user with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'username',
      email: 'test@test.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'test@test.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
