const asyncHandler = require("express-async-handler");

/**
 * Attach pagination metadata to req and modify the query for limit/offset.
 *
 * Usage as middleware:
 *   router.get('/', paginate(20, 100), handler)
 *
 * In handler:
 *   const results = await Model.find(req.query)
 *     .skip(req.skip)
 *     .limit(req.limit);
 *
 * Returns:  req.limit, req.skip, req.page
 *           req.pagination = { page, limit, total, pages, hasNext, hasPrev }
 */
exports.paginate = (defaultLimit = 20, maxLimit = 100) =>
  asyncHandler(async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(maxLimit, parseInt(req.query.limit) || defaultLimit);
    const skip = (page - 1) * limit;

    req.page = page;
    req.limit = limit;
    req.skip = skip;

    next();
  });

/**
 * Build a paginated result set.
 *
 * Usage:
 *   const result = await buildPaginated(Model, query, req, options);
 *
 * Options:
 *   populate  , string or array of populate paths
 *   sort      , sort string, e.g. "-createdAt"
 *   select    , field selection string
 *   extraMeta , function(total, result) → additional meta object
 */
exports.buildPaginated = async (Model, query, req, options = {}) => {
  const { populate, sort = "-createdAt", select, extraMeta } = options;

  const countQuery = Model.find(query);
  const total = await countQuery.countDocuments();

  let dataQuery = Model.find(query)
    .sort(sort)
    .skip(req.skip)
    .limit(req.limit);

  if (populate) dataQuery = dataQuery.populate(populate);
  if (select) dataQuery = dataQuery.select(select);

  const data = await dataQuery;

  const pages = Math.ceil(total / req.limit);

  const pagination = {
    page: req.page,
    limit: req.limit,
    total,
    pages,
    hasNext: req.page < pages,
    hasPrev: req.page > 1,
    ...(typeof extraMeta === "function" ? extraMeta(total, data) : {}),
  };

  return { data, pagination };
};
