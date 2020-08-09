import React from "react";
import { mount, shallow, ReactWrapper } from "enzyme";
import { TransExpenseTemplates } from "~/components/organisms/TransExpenseTemplates";
import { AppThemeProvider } from "~/components/Provider";
import toJson from "enzyme-to-json";
import { TransExpenseTemplateView } from "~/types";
import { wait, setValue } from "~/components/test_util";

function clickCreateButton(wrapper: ReactWrapper) {
  wrapper
    .find("button")
    .last()
    .simulate("click");
}

function clickEditButton(wrapper: ReactWrapper, index: number = 0) {
  wrapper
    .find("tbody tr")
    .at(index)
    .find("button")
    .first()
    .simulate("click");
}

describe("<TransExpenseTemplates />", () => {
  it("shallow snap shot", () => {
    const spyCreate = jest.fn();
    const spyUpdate = jest.fn();
    const spyDelete = jest.fn();
    const $ = shallow(
      <AppThemeProvider>
        <TransExpenseTemplates
          templates={[]}
          projects={[]}
          usages={[]}
          objectives={[]}
          createExpenseTemplate={spyCreate}
          updateExpenseTemplate={spyUpdate}
          deleteExpenseTemplate={spyDelete}
        />
      </AppThemeProvider>
    );

    expect(toJson($)).toMatchSnapshot("");
  });

  describe("mount with no templates", () => {
    const spyCreate = jest.fn();
    const spyUpdate = jest.fn();
    const spyDelete = jest.fn();
    const $ = mount(
      <AppThemeProvider>
        <TransExpenseTemplates
          templates={[]}
          projects={[]}
          usages={[]}
          objectives={[]}
          createExpenseTemplate={spyCreate}
          updateExpenseTemplate={spyUpdate}
          deleteExpenseTemplate={spyDelete}
        />
      </AppThemeProvider>
    );
    it("交通費がテンプレートに未登録である旨を表示する", () => {
      expect(
        $.text().includes(
          "交通費テンプレートがブラウザに登録されていません。登録しますか？"
        )
      ).toBe(true);
    });

    it("作成ボタンを押す -> テンプレート作成ダイアログを表示する", () => {
      expect($.find("form").exists()).toBe(false);
      $.find("button#create-trans-expense-template").simulate("click");
      expect($.find("form").exists()).toBe(true);
    });
  });

  describe("mount with some templates", () => {
    const spyCreate = jest.fn();
    const spyUpdate = jest.fn();
    const spyDelete = jest.fn();
    const fakeTemplates: TransExpenseTemplateView[] = [
      {
        templateId: "98bd5d97-a169-4fc1-a8a7-f1565e48f162",
        templateName: "template 1",
        customer: "TELEMA",
        project: {
          name: "",
          projectId: ""
        },
        usage: {
          name: "",
          usageId: ""
        },
        objective: {
          name: "",
          objectiveId: ""
        },
        from: "Tokyo Station",
        to: "Chiba Station",
        cost: 999
      },
      {
        templateId: "12azkz68-d769-4fc1-a8n8-b1885e48f162",
        templateName: "template 2",
        project: {
          name: "",
          projectId: ""
        },
        usage: {
          name: "",
          usageId: ""
        },
        objective: {
          name: "",
          objectiveId: ""
        },
        customer: "Dummy Company Ctd.",
        from: "Sapporo Station",
        to: "Aomori Station",
        cost: 1240
      },
      {
        templateId: "b83014cd-c6d7-478a-b133-7363b710832d",
        templateName: "template 3",
        project: {
          name: "",
          projectId: ""
        },
        usage: {
          name: "",
          usageId: ""
        },
        objective: {
          name: "",
          objectiveId: ""
        },
        customer: "Dummy Company Ctd.",
        from: "Yokohama Station",
        to: "Shinjuku Station",
        cost: 560
      }
    ];
    const $ = mount(
      <AppThemeProvider>
        <TransExpenseTemplates
          templates={fakeTemplates}
          projects={[{ name: "Project X", projectId: "201108010001" }]}
          usages={[{ name: "交通費(往復)", usageId: "3" }]}
          objectives={[{ name: "作業", objectiveId: "2" }]}
          createExpenseTemplate={spyCreate}
          updateExpenseTemplate={spyUpdate}
          deleteExpenseTemplate={spyDelete}
        />
      </AppThemeProvider>
    );

    it("指定されたテンプレート数のレコードを表示する", () => {
      expect($.find("tbody tr").length).toBe(3);
    });

    describe("作成モーダル", () => {
      beforeAll(() => {
        clickCreateButton($);
      });

      it("作成モーダルフォーム", () => {
        expect($.find("form").length).toBe(1);
      });

      describe("未入力項目ありでサブミット", () => {
        beforeAll(() => {
          $.find("form").simulate("submit");
        });

        it("テンプレート作成関数は呼ばれない", async () => {
          await wait();
          expect(spyCreate.mock.calls.length).toBe(0);
        });
      });

      describe("未入力項目なしでサブミット", () => {
        beforeAll(() => {
          setValue($, "templateName", "サンプルテンプレート");
          setValue($, "customer", "XXXX 株式会社");
          setValue($, "from", "JR 東京駅");
          setValue($, "to", "JR 名古屋駅");
          setValue($, "cost", "1000");
          $.find("form").simulate("submit");
        });

        it("テンプレート作成関数が呼ばれる", async () => {
          await wait();
          expect(spyCreate.mock.calls.length).toBe(1);
          expect(spyCreate.mock.calls[0][0]).toEqual({
            templateName: "サンプルテンプレート",
            customer: "XXXX 株式会社",
            from: "JR 東京駅",
            to: "JR 名古屋駅",
            cost: 1000,
            objectiveId: "2",
            projectId: "201108010001",
            usageId: "3"
          });
        });
      });
    });

    describe("編集モーダル", () => {
      beforeAll(() => {
        clickEditButton($);
      });

      it("編集モーダルフォーム", () => {
        expect($.find("form").length).toBe(1);
      });

      describe("未入力項目なしでサブミット", () => {
        beforeAll(() => {
          setValue($, "templateName", "サンプルテンプレート");
          setValue($, "customer", "XXXX 株式会社");
          setValue($, "from", "JR 東京駅");
          setValue($, "to", "JR 名古屋駅");
          setValue($, "cost", "1000");
          $.find("form").simulate("submit");
        });

        it("テンプレート作成関数が呼ばれる", async () => {
          await wait();
          expect(spyUpdate.mock.calls.length).toBe(1);
          expect(spyUpdate.mock.calls[0][0]).toEqual({
            templateId: "98bd5d97-a169-4fc1-a8a7-f1565e48f162",
            templateName: "サンプルテンプレート",
            customer: "XXXX 株式会社",
            from: "JR 東京駅",
            to: "JR 名古屋駅",
            cost: 1000,
            objectiveId: "2",
            projectId: "201108010001",
            usageId: "3"
          });
        });
      });
    });
  });
});
