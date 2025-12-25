import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle a signup request', async () => {
    const myEmail = 'aaavabcc@aaa.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: myEmail, password: 'hghghhghg' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(myEmail);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const myEmail = 'asdf@asdf.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: myEmail, password: 'hghghhghg' })
      .expect(201);
    const cookie = res.headers['set-cookie'];
    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(myEmail);
  });
});
