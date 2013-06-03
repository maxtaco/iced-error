// Generated by IcedCoffeeScript 1.6.2d
(function() {
  var BaseError, EscErr, EscOk, c_to_camel, ipush, make_error_klass, make_errors, make_esc, to_lower, util,
    __slice = [].slice;



  util = require('util');

  exports.BaseError = BaseError = function(msg, constructor) {
    Error.captureStackTrace(this, this.constructor);
    return this.message = msg || 'Error';
  };

  util.inherits(BaseError, Error);

  BaseError.prototype.name = "BaseError";

  to_lower = function(s) {
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
  };

  c_to_camel = function(s) {
    var p;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = s.split(/_/);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        _results.push(to_lower(p));
      }
      return _results;
    })()).join('');
  };

  make_error_klass = function(k) {
    var ctor;
    ctor = function(msg) {
      BaseError.call(this, msg, this.constructor);
      this.istack = [];
      return this;
    };
    util.inherits(ctor, BaseError);
    ctor.prototype.name = k;
    ctor.prototype.inspect = function() {
      return "[" + k + ": " + this.message + "]";
    };
    return ctor;
  };

  exports.make_errors = make_errors = function(d) {
    var enam, errno, k, msg, out, val;
    out = {
      msg: {},
      name: {},
      code: {}
    };
    d.OK = "Success";
    errno = 100;
    for (k in d) {
      msg = d[k];
      if (k !== "OK") {
        enam = (c_to_camel(k)) + "Error";
        out[enam] = make_error_klass(enam);
        val = errno++;
      } else {
        val = 0;
      }
      out[k] = val;
      out.msg[k] = out.msg[val] = msg;
      out.name[k] = out.name[val] = k;
      out.code[k] = val;
    }
    return out;
  };

  ipush = function(e, msg) {
    if (msg != null) {
      if (e.istack == null) {
        e.istack = [];
      }
      return e.istack.push(msg);
    }
  };

  exports.make_esc = make_esc = function(gcb, where) {
    return function(lcb) {
      return function() {
        var args, err;
        err = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (err == null) {
          return lcb.apply(null, args);
        } else if (!gcb.__esc) {
          gcb.__esc = true;
          ipush(err, where);
          return gcb(err);
        }
      };
    };
  };

  exports.EscOk = EscOk = (function() {
    function EscOk(gcb, where) {
      this.gcb = gcb;
      this.where = where;
    }

    EscOk.prototype.bailout = function() {
      var t;
      if (this.gcb) {
        t = this.gcb;
        this.gcb = null;
        return t(false);
      }
    };

    EscOk.prototype.check_ok = function(cb) {
      var _this = this;
      return function() {
        var args, ok;
        ok = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!ok) {
          return _this.bailout();
        } else {
          return cb.apply(null, args);
        }
      };
    };

    EscOk.prototype.check_err = function(cb) {
      var _this = this;
      return function() {
        var args, err;
        err = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (err != null) {
          ipush(err, _this.where);
          return _this.bailout();
        } else {
          return cb.apply(null, args);
        }
      };
    };

    EscOk.prototype.check_non_null = function(cb) {
      var _this = this;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (args[0] == null) {
          return _this.bailout();
        } else {
          return cb.apply(null, args);
        }
      };
    };

    return EscOk;

  })();

  exports.EscErr = EscErr = (function() {
    function EscErr(gcb, where) {
      this.gcb = gcb;
      this.where = where;
    }

    EscErr.prototype.finish = function(err) {
      var t;
      if (this.gcb) {
        t = this.gcb;
        this.gcb = null;
        return t(err);
      }
    };

    EscErr.prototype.check_ok = function(cb, eclass, emsg) {
      if (eclass == null) {
        eclass = Error;
      }
      if (emsg == null) {
        emsg = null;
      }
      return function() {
        var args, err, ok;
        ok = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (!ok) {
          err = new eclass(emsg);
          ipush(err, this.where);
          return this.finish(err);
        } else {
          return cb.apply(null, args);
        }
      };
    };

    EscErr.prototype.check_err = function(cb) {
      return function() {
        var args, err;
        err = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        if (err != null) {
          ipush(err, this.where);
          return this.finish(err);
        } else {
          return cb.apply(null, args);
        }
      };
    };

    return EscErr;

  })();

}).call(this);

/*
//@ sourceMappingURL=index.map
*/
