import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import * as express from 'express'
import * as logger from 'morgan'
import * as path from 'path'
import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import * as session from 'express-session'
import * as postgresSession from 'connect-pg-simple'

import * as noteController from './controllers/note'

/**
 * Create Express server.
 */
const app = express()

const PostgresStore = postgresSession(session)

/**
 * Load environment variables from file `.env` to `process.env`.
 * @see https://www.npmjs.com/package/dotenv#faq
 *
 * 'dotenv-expand' add supports for variable expansion.
 * @see https://github.com/motdotla/dotenv-expand
 */
dotenvExpand(dotenv.config())


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
 * About session options,
 * @see https://github.com/expressjs/session#options
 *
 * Here we use Postgres as a storage for session (Redis could be
 * used for faster performance here).
 * 1 extra thing we need to do is creating a `session` table in
 * Postgres. To do this, use the file `asset/scripts/sql/table.sql`:
 *
 * ```
 * psql DATABASE_NAME < asset/scripts/sql/table.sql
 * ```
 *
 * @see https://www.npmjs.com/package/connect-pg-simple
 */
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new PostgresStore({
    tableName : 'session',
    conString: process.env.POSTGRES_CONNECTION_STRING
  }),
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}))

app.use(passport.initialize())
app.use(passport.session())

/**
 * Middleware `morgan` logs request and response. In production, log should
 * also be written to file.
 *
 * @see https://github.com/expressjs/morgan
 */
app.use(logger('dev'))


/**
 * ============================================================================
 * Primary app routes.
 *
 * @see http://expressjs.com/en/guide/routing.html
 * ============================================================================
 */
app.get('/', (req, res) => res.send('Hello World'))
app
  .route('/note')
  .get(noteController.index)
  .post(noteController.create)
  .delete(noteController.remove)


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
