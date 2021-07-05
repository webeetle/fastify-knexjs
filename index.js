'use strict'

const fp = require('fastify-plugin')
const knexjs = require('knex')

async function weBeetleFastifyKnexJS (fastify, opts) {
  const name = opts.name || 'knex'
  if (opts.name) {
    delete opts.name
  }

  try {
    const knexInstance = knexjs(opts)
    fastify.decorate(name, knexInstance)
    fastify.addHook('onClose', (instance, done) => {
      if (instance[name] === knexInstance) {
        instance[name].destroy()
        delete instance[name]
      }

      done()
    })
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = fp(weBeetleFastifyKnexJS, {
  fastify: '>= 2.0.0'
})
