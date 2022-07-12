const TIME_TO_CONNECTION = process.env.TIME_TO_CONNECTION || 10000;
const WORK_NAME = process.env.WORK || '- no name';

const poll = ({ fn, validate, interval, maxAttempts }) => {
  console.log("Init poll -", WORK_NAME);
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    console.log("-- executePoll", WORK_NAME, new Date().getTime());
    const result = await fn();
    attempts++;

    // connection exist
    if (validate(result)) {
      console.log('RESPONSE api mock:', fakeConnection);
      fakeConnection = null;
    }
    if (maxAttempts && attempts === parseInt(maxAttempts)) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };
  return new Promise(executePoll);
};

let fakeConnection = null;
const getConnection = (() => {
  setTimeout(() => {
    fakeConnection = {
      id: WORK_NAME
    };
  }, TIME_TO_CONNECTION);
})();

const mockApi = async () => {
  return fakeConnection;
};

const validateConn = (conn) => !!conn;
const POLL_INTERVAL = process.env.POLL_INTERVAL || 1000;
const MAX_ATTEMPTS = process.env.MAX_ATTEMPTS || -1;

const pollForNewConn = poll({
  fn: mockApi,
  validate: validateConn,
  interval: POLL_INTERVAL,
  maxAttempts: MAX_ATTEMPTS,
})
  .then((conn) => console.log(conn))
  .catch((err) => console.error(err));
