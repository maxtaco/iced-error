
util = require 'util'

exports.BaseError = BaseError = (msg, constructor) ->
  Error.captureStackTrace @, @constructor
  @message = msg or 'Error'

util.inherits BaseError, Error
BaseError.prototype.name = "BaseError"

to_lower   = (s) -> (s[0].toUpperCase() + s[1...].toLowerCase())
c_to_camel = (s) -> (to_lower p for p in s.split /_/).join ''

make_error_klass = (k) ->
  ctor = (msg) -> 
    BaseError.call(this, msg, this.constructor)
  util.inherits ctor, BaseError
  ctor.prototype.name = k
  ctor

exports.make_errors = make_errors = (d) ->
  out = {}
  for k,v of d
    enam = (c_to_camel k) + "Error"
    out[enam] = make_error_klass enam
  out

d = make_errors 
  FOO : "boob dood"
  HAVE_ONE_ON_ME : "ok then"

f = () ->
  throw new d.FooError "shit dog"

try
  f()
catch e
  if (e instanceof d.FooError)
    console.log "Good!"
    console.log util.inspect (new Error "wh?")

