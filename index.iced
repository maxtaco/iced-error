
util = require 'util'

class AbstractError extends Error
  constructor : (msg) ->
    super()
    Error.captureStackTrace @, @constructor
    @name = @constructor.name
    @message = msg or 'Error'

exports.make_errors = (d) ->