/*
 * Enzyme setup
 * see: http://airbnb.io/enzyme/docs/installation/
 */
const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
configure({ adapter: new Adapter() });

/**
 * Mocks setup
 */
jest.mock("~/helpers/http");

// MutationObserverのmock
// おそらくuseFormライブラリの中でMutationObserverが使われている
// Reference: https://stackoverflow.com/questions/48809753/testing-mutationobserver-with-jest
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};
