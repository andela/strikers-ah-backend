/**
 * @author Innocent Nkunzi
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
      return res.status(400).json({ message: err });
    }
  };
}
export default ErrorHander;
