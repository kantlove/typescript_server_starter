import * as express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'
import * as path from 'path'
import * as logger from 'morgan'
import 'reflect-metadata'
import { createConnection } from 'typeorm'

/**
 * Create Express server.
 */
const app = express()

// Load environment variables from file `.env` to `process.env`
dotenv.config()


/**
 * ============================================================================
 * Express configuration.
 *
 * @see http://expressjs.com/en/api.html#app.settings.table
 * ============================================================================
 */
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, '../views')) // set the path to the view templates
/**
 * Set template engine to 'pug'. This allows creating HTML from a cleaner format
 * in the *.pug files.
 *
 * @see https://github.com/pugjs/pug
 */
app.set('view engine', 'pug')


/**
 * ============================================================================
 * Adding Express middlewares
 *
 * @see http://expressjs.com/en/guide/using-middleware.html
 * ============================================================================
 */
/**
 * Middleware `body-parser` helps parse the incoming request body and provide
 * the parsed result in `req.body`.
 *
 * @see https://github.com/expressjs/body-parser#body-parser
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
/**
 * Middleware `morgan` logs request and response. In production, log should
 * also be written to file.
 *
 * @see https://github.com/expressjs/morgan
 */
app.use(logger('dev'))


/**
 * ============================================================================
 * Models (correspond to tables in database)
 * ============================================================================
 */
import { Photo } from './models/Photo'

/**
 * ============================================================================
 * Controllers (route handlers).
 * ============================================================================
 */
import * as homeController from './controllers/home'


/**
 * ============================================================================
 * Connect to the database.
 * ============================================================================
 */
createConnection({
  type: 'postgres',
  host: process.env.POSTGRES_URI,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [
    __dirname + '/models/*.js' // `__dirname` is the directory name of the current module
  ],
  synchronize: true,
  logging: false
})
.then(async connection => {
  console.log('Successfully connected to DB ' + connection.name)

  const photo = new Photo()
  photo.name = 'Me and Bears'
  photo.views = 1

  const photoRepository = connection.getRepository(Photo)

  await photoRepository.save(photo)
  console.log('Photo has been saved')

  const savedPhotos = await photoRepository.find()
  console.log('All photos from the db: ', savedPhotos)
})
.catch(error => console.log(error))


/**
 * ============================================================================
 * Primary app routes.
 *
 * @see http://expressjs.com/en/guide/routing.html
 * ============================================================================
 */
app.get('/', (req, res) => res.send('Hello World'))
app
  .route('/home')
  .get(homeController.index)
  .post(homeController.custom)


/**
 * ============================================================================
 * Start Express server.
 * ============================================================================
 */
app.listen(app.get('port'), () => {
  const env = app.get('env') // returns 'development' if NODE_ENV is not defined
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), env)
  console.log('  Press CTRL-C to stop\n')
})
