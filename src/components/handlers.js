const handleError = (err, errors) => {
  let e = err.response.data.error;
  if (e) errors.push(e); 
  else errors.push("Unsuccessful action");
};

const handleSuccess = (res, successes) => {
  let m = res.data.message; 
  if (m) {
    successes.push(m);
  }
};

const clearMessages = (errors, successes) => {
  setInterval(() => {
    errors.splice(0, errors.length);
    successes.splice(0, successes.length);
  }, 5000);
};

const clearMessagesImmediate = (errors, successes) => {
  errors.splice(0, errors.length);
  successes.splice(0, successes.length);
};

module.exports = { 
  handleError, 
  handleSuccess, 
  clearMessages,
  clearMessagesImmediate
};