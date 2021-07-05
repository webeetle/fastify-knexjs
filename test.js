'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const weBeetleKnexjs = require('./index')

test('Single KnexJS instance', t => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(weBeetleKnexjs, { client: 'mysql' })
    .ready((err) => {
      t.error(err)
      t.ok(fastify.knex)
    })
})

test('Multiple KnexJS instance', t => {
  t.plan(3)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(weBeetleKnexjs, { client: 'mysql' })
    .register(weBeetleKnexjs, { client: 'mysql', name: 'knex2' })
    .ready((err) => {
      t.error(err)
      t.ok(fastify.knex)
      t.ok(fastify.knex2)
    })
})

test('Register KnexJS instance with same name', t => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(weBeetleKnexjs, { client: 'mysql' })
    .register(weBeetleKnexjs, { client: 'mysql' })
    .ready(err => {
      t.ok(err)
      t.equal(err.message, "The decorator 'knex' has already been added!")
    })
})

test('Fail with no client configuration', (t) => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(weBeetleKnexjs, {})
    .ready(err => {
      t.ok(err)
      t.match(err.message, "knex: Required configuration option 'client' is missing")
    })
})
