import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { User, UserNotFound } from '../models/User'
import { db } from '../services/db'

/**
 * Defines how a user is represented in session table.
 * @see https://github.com/jaredhanson/passport#sessions
 */
passport.serializeUser((user: User, done) => {
  console.log(user)
  done(undefined, user.id)
})

/**
 * Defines how to get back the user using its representation
 * in the session table.
 * In this case, since we serialized our user to an id, we will
 * use that id to find the user.
 * @see https://github.com/jaredhanson/passport#sessions
 */
passport.deserializeUser((id: number, done) => {
  db(connection => {
    return User.queries.findOneByID(id)(connection)
      .then(rs => {
        rs.match({
          some: user => done(undefined, user),
          none: () => done(new UserNotFound())
        })
      })
      .catch(err => done(err))
  })
})

/**
 * Defines the logic for authenticating using email and password
 * for `passport`.
 * @see http://www.passportjs.org/docs/username-password/
 */
passport.use(new LocalStrategy(
  {
    // define the name of the fields so `passport` can find it in the request
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    console.log(`Authenticating email "${email}", and password "${password}"`)

    db(async connection => {
      try {
        const maybeUser = await User.queries.findOne({ email: email, password: password })(connection)
        maybeUser.match({
          some: user => done(undefined, user),
          none: () => done(undefined, false, { message: 'User with this email and password is not found' })
        })
      }
      catch (err) {
        done(err)
      }
    })
  }
))
