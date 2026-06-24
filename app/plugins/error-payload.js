export default definePayloadPlugin((nuxtApp) => {
  definePayloadReducer('apiError', (value) => {
    return value instanceof Error && {
      _isError: true,
      message: value.message,
      stack: value.stack,
    };
  });
  definePayloadReviver('apiError', (value) => {
    if (value && value._isError) {
      const err = new Error(value.message);
      err.stack = value.stack;
      return err;
    }
    return false;
  });
});
