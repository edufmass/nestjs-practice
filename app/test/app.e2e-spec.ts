import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarDto, EditBookmarDto } from 'src/bookmark/dto';

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

    describe('Edit user', () => {
      const dto: EditUserDto = {
        email: 'edufmass@editedmail.com',
        firstName: 'Edu',
        lastName: 'Mass'
      }
      it('Should update user first and last name', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .patch('/users')
          .withBody({
            firstName: dto.firstName,
            lastName: dto.lastName
          })
          .expectStatus(200)
      });
    });
  });

  describe('Bookmark', () => {
    const createBookmarDto: CreateBookmarDto = {
      title: 'My first bookmark',
      description: 'Short description of my first bookmak',
      url: 'http://bookmark1.com'
    }
    describe('Get empty bookmarks', () => {
      it('Should get empty bookmarks', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .get('/bookmarks')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      it('Should create a bookmark', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .post('/bookmarks')
          .withBody(createBookmarDto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });

      it('Should create a bookmark', () => {
        createBookmarDto.title = 'My second bookmark';
        createBookmarDto.description = 'Short description of my second bookmak';
        createBookmarDto.url = 'http://bookmark2.com';

        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .post('/bookmarks')
          .withBody(createBookmarDto)
          .expectStatus(201);
      });

      it('Should create a bookmark', () => {
        createBookmarDto.title = 'My third bookmark';
        createBookmarDto.description = 'Short description of my third bookmak';
        createBookmarDto.url = 'http://bookmark3.com';

        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .post('/bookmarks')
          .withBody(createBookmarDto)
          .expectStatus(201);
      });
    });

    describe('Edit bookmark by id', () => {
      const bookmarkEditDto: EditBookmarDto = {
        title: 'First bookmark edited!'
      }

      it('Should edit bookmark by id', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(bookmarkEditDto)
          .expectStatus(200)
          .expectBodyContains(bookmarkEditDto.title);
      });
    });

    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .get('/bookmarks')
          .expectStatus(200)
          .expectJsonLength(3).inspect();
      });
    });

    describe('Get bookmark by id', () => {
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Get bookmark by userId', () => {
      it('Should get bookmark by user id', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .get('/bookmarks/user/{id}')
          .withPathParams('id','74') // bad practice test
          .expectStatus(200)
          .expectJsonLength(3);
      });
    });

    describe('Delete bookmark by id', () => {
      it('Should delete bookmarkby id', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(204);
      });

      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .withBearerToken('$S{userToken}')
          .get('/bookmarks')
          .expectStatus(200)
          .expectJsonLength(2);
      });
    });


  });

});
