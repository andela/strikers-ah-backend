/**
 *
 * @param {object} cb
 * @param {object} req
 * @param {object} res
 * @returns {object} returns an object
 */
function ErrorHander(cb) {
  return async (req, res, nex) => {
    try {
      await cb(req, res, nex);
    } catch (err) {
      return res.status(400).json({ error: err.name === 'SequelizeValidationError' ? err.message : err });
    }
  };
}
export default ErrorHander;
