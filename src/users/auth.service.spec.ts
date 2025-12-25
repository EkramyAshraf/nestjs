import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  beforeEach(async () => {
    //create a fake copy of user service
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with a salted and hashed password', async () => {
    const user = await service.signup('asddh@gmail.com', 'fgsffghsstg');
    expect(user.password).not.toEqual('fgsffghsstg');
    const [salt, hashed] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hashed).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdfs@ghg.com', 'mypassword');
    await expect(service.signup('asdfs@ghg.com', 'mypassword')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if user signs in with unused email', async () => {
    await expect(service.signin('agvv@nnn.com', 'fhggghff')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throw if an invalid password is provided', async () => {
    await service.signup('asdfs@ghg.com', 'mypassword');
    await expect(service.signin('asdfs@ghg.com', 'gfghfhgf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if password correct', async () => {
    await service.signup('asdfs@ghg.com', 'mypassword');
    const user = await service.signin('asdfs@ghg.com', 'mypassword');
    expect(user).toBeDefined();
  });
});
