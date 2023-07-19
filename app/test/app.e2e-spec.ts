import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App (e2e)', () => {

  let app: INestApplication;
  let db: DatabaseService;
  let appPort: number = 3333;
  let apiUrl: string = 'http:/localhost:' + appPort;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(appPort);

    db = app.get(DatabaseService);
    await db.cleanDb();

    pactum.request.setBaseUrl(apiUrl);
  });

  afterAll(() => {
    app.close();
  })

  it.todo('should pass');

  describe('Auth', () => {

    const dto: AuthDto = {
      email: 'edufmass@example.com',
      password: 'mypasswd123'
    }

    describe('Signup', () => {
      it('Should throw if empty mail', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      it('Should throw if empty password', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      it('Should throw if empty mail and password', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('Should throw if empty mail', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);
      });

      it('Should throw if empty password', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email
          })
          .expectStatus(400);
      });

      it('Should throw if empty mail and password', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(400);
      });

      it('Should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}') // or .withHeaders({ Authorization: 'Bearer $S{userToken}', })
          .get('/users/me')
          .expectStatus(200)
      });
    });

    describe('Edit user', () => { });
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => { });
    describe('Edit bookmark by id', () => { });
    describe('Delete bookmark by id', () => { });
    describe('Get bookmarks', () => { });
    describe('Get bookmark by id', () => { });
    describe('Get bookmark by userId', () => { });
  });

});
