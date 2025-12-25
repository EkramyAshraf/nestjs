import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'gfggghhgghg' } as User,
        ]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'aaaa@ggg.com',
          password: 'hgghgg',
        } as User);
      },
      // update:()=>{}
      // remove:()=>{}
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email: 'aaaa@aaaa.com',
          password: 'aaaahggg',
        } as User);
      },
      // signup:()=>{},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users return a list of users with given email', async () => {
    const users = await controller.findAllUses('aaaa@aaa.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('aaaa@aaa.com');
  });

  it('find user return a users with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('find user throw an error with given id not found', async () => {
    fakeUserService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin update session and return user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'aaaa@aaaa.com', password: 'aaaahggg' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
    expect(user).toBeDefined();
  });
});
