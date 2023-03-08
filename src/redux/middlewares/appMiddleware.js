const appMiddleware =
  ({dispatch, getState}) =>
    (next) =>
      (action) => {
        return next(action);
      };
export default appMiddleware;