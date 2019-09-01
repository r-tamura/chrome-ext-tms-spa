import React from "react";
import { TransportExpensePage } from "..";
import { shallow } from "enzyme";
import * as hooks from "~/stores/hooks";

jest.mock("../../../stores/hooks");
const mockedHooks = hooks as jest.Mocked<typeof hooks>;
describe("<TransportExpensePage />", () => {
  it("should be an AppGrid item with navbar", () => {
    mockedHooks.useTranspotation.mockReturnValue({
      expenses: [],
      templates: [],
      projects: [],
      usages: [],
      objectives: [],
      fetchExpensesAll: jest.fn(),
      createExpense: jest.fn(),
      createExpenseFromTemplate: jest.fn(),
      deleteExpense: jest.fn(),
      updateExpense: jest.fn(),
      fetchExpenseTemplatesAll: jest.fn(),
      createExpenseTemplate: jest.fn(),
      deleteExpenseTemplate: jest.fn(),
      updateExpenseTemplate: jest.fn()
    });

    const wrapper = shallow(<TransportExpensePage />);

    expect(wrapper.hasClass("app-content-with-navbar")).toBe(true);
  });
});
