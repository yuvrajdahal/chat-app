const advanceResult = (model, populate) => async (req, res, next) => {
  let query
  const reqQuery = { ...req.query }
  let removeFields = ['select', 'sort']
  removeFields.forEach((param) => delete reqQuery[param])
  let queryString = JSON.stringify(reqQuery)

  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in|match|regex|not)\b/g,
    (match) => `$${match}`
  )
  console.log(JSON.parse(queryString))

  query = model.find(JSON.parse(queryString))

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }
  if (req.query.sort) {
    const sortBy = req.query.select.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  if (populate) {
    query = query.populate(populate)
  }

  const results = await query
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex < 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.advanceResults = {
    success: true,
    count: results.length,
    total,
    pagination,
    data: results,
  }
  next()
}
export default advanceResult
