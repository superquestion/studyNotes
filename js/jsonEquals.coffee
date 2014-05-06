Object::jsonEquals = (x) ->
  x1 = JSON.parse(JSON.stringify(this))
  x2 = JSON.parse(JSON.stringify(x))

  p = null
  for p of x1
    return false if typeof (x2[p]) is 'undefined'
  for p of x1
    if x1[p]
      switch typeof (x1[p])
        when 'object'
          return false unless x1[p].jsonEquals(x2[p])
        when 'function'
          return false if typeof (x2[p]) is 'undefined' or (p isnt 'equals' and x1[p].toString() isnt x2[p].toString())
        else
          return false  unless x1[p] is x2[p]
    else
      return false if x2[p]
  for p of x2
    return false if typeof (x1[p]) is 'undefined'
  true
