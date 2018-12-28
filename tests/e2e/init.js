const Telnet = require("telnet-client");
const adapter = require("detox/runners/jest/adapter");
const config = require("../package.json").detox;
const detox = require("detox");
const fs = require("fs");
const path = require("path");

const telnetParams = {
  host: "127.0.0.1",
  port: 5554,
  shellPrompt: "OK\r",
  timeout: 2500
};

const tokenFilePath = path.join(
  process.env.HOME,
  ".emulator_console_auth_token"
);

const getEmulatorAuthToken = () => fs.readFileSync(tokenFilePath, "utf8");

jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

beforeAll(async () => {
  await detox.init(config);

  const connection = new Telnet();
  await connection.connect(telnetParams);
  const token = getEmulatorAuthToken();
  await connection.exec(`auth ${token}`);

  global.connection = connection;
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
  await connection.end();
});
