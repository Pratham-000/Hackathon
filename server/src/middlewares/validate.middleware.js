const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    if (parsed.data.body) req.body = parsed.data.body;
    if (parsed.data.params) req.params = parsed.data.params;
    if (parsed.data.query) req.query = parsed.data.query;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = validate;