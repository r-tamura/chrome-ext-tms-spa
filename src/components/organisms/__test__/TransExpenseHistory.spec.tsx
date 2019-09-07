import React from "react";
import { shallow, mount, ReactWrapper } from "enzyme";
import { TransExpenseHistory } from "../TransExpenseHistory";
import toJson from "enzyme-to-json";
import { AppThemeProvider } from "~/components/Provider";
import { TransExpenseView } from "~/types";
import { setValue, wait } from "~/components/test_util";

function clickCreateButton(wrapper: ReactWrapper) {
  wrapper
    .find("button")
    .last()
    .simulate("click");
}

function clickCreateFromTemplateButton(wrapper: ReactWrapper) {
  wrapper.find(`button[color="secondary"]`).simulate("click");
}

describe("<TransExpenseHistory />", () => {
  it("shallow render snapshot", () => {
    const spyCreate = jest.fn();
    const spyCreateFromTemplate = jest.fn();
    const spyUpdate = jest.fn();
    const spyDelete = jest.fn();
    expect(
      toJson(
        shallow(
          <TransExpenseHistory
            expenses={[]}
            templates={[]}
            projects={[]}
            usages={[]}
            objectives={[]}
            createExpense={spyCreate}
            createExpenseFromTemplate={spyCreateFromTemplate}
            updateExpense={spyUpdate}
            deleteExpense={spyDelete}
          />
        )
      )
    ).toMatchSnapshot();
  });

  describe("mount with no expenses", () => {
    const spyCreate = jest.fn();
    const spyCreateFromTemplate = jest.fn();
    const spyUpdate = jest.fn();
    const spyDelete = jest.fn();
    const $ = mount(
      <AppThemeProvider>
        <TransExpenseHistory
          expenses={[]}
          templates={[
            {
              templateId: "xxxx-yyyy",
              templateName: "Template A",
              customer: "XXXX K.K.",
              project: { name: "Project X", projectId: "201108010001" },
              usage: { name: "交通費(往復)", usageId: "3" },
              objective: { name: "作業", objectiveId: "2" },
              from: "Stop A",
              to: "Stop B",
              cost: 1000
            }
          ]}
          projects={[{ name: "Project A", projectId: "1234" }]}
          usages={[{ name: "交通費(片道)", usageId: "1" }]}
          objectives={[{ name: "作業", objectiveId: "1" }]}
          createExpense={spyCreate}
          createExpenseFromTemplate={spyCreateFromTemplate}
          updateExpense={spyUpdate}
          deleteExpense={spyDelete}
        />
      </AppThemeProvider>
    );

    it("登録されていない旨のメッセージ表示する", () => {
      expect($.find("p").text()).toBe("交通費が登録されていません。");
    });

    it("新規作成ボタンを押したときに、入力フォームを表示する", () => {
      expect($.find("form").length).toBe(0);
      $.find("button#create-trans-expense").simulate("click");
      expect($.find("form").length).toBe(1);
    });
  });

  describe("mount with some expenses", () => {
    const spyCreate = jest.fn();
    const spyCreateFromTemplate = jest.fn();
    const spyUpdate = jest.fn();
    const spyDelete = jest.fn();
    const fakeExpenses: TransExpenseView[] = [
      {
        expenseId: "7980",
        strdate: "20190701",
        customer: "XXXX株式会社",
        from: "JR 東京駅",
        to: "JR 新宿駅",
        cost: 777,
        project: {
          name: "Project X",
          projectId: "201108010001"
        },
        usage: {
          name: "交通費(往復)",
          usageId: "3"
        },
        objective: {
          name: "作業",
          objectiveId: "2"
        }
      },
      {
        expenseId: "7981",
        strdate: "20190720",
        customer: "YYYY株式会社",
        from: "JR 津田沼駅",
        to: "JR 千葉駅",
        cost: 211,
        project: {
          name: "Project Y",
          projectId: "201108010002"
        },
        usage: {
          name: "交通費(片道)",
          usageId: "1"
        },
        objective: {
          name: "打ち合わせ",
          objectiveId: "1"
        }
      }
    ];
    const $ = mount(
      <AppThemeProvider>
        <TransExpenseHistory
          expenses={fakeExpenses}
          templates={[
            {
              templateId: "xxxx-yyyy",
              templateName: "Template A",
              customer: "XXXX K.K.",
              project: { name: "Project X", projectId: "201108010001" },
              usage: { name: "交通費(往復)", usageId: "3" },
              objective: { name: "作業", objectiveId: "2" },
              from: "Stop A",
              to: "Stop B",
              cost: 1000
            }
          ]}
          projects={[{ name: "Project X", projectId: "201108010001" }]}
          usages={[{ name: "交通費(往復)", usageId: "3" }]}
          objectives={[{ name: "作業", objectiveId: "2" }]}
          createExpense={spyCreate}
          createExpenseFromTemplate={spyCreateFromTemplate}
          updateExpense={spyUpdate}
          deleteExpense={spyDelete}
        />
      </AppThemeProvider>
    );

    it("登録された交通費データ分のデータを表示する", () => {
      expect($.find("tbody tr").length).toBe(2);
    });

    it("デフォルトでは編集モーダルは表示しない", () => {
      expect($.find("form").length).toBe(0);
    });

    describe("作成モーダル", () => {
      beforeEach(() => {
        clickCreateButton($);
      });

      describe("表示", () => {
        it("編集フォーム", () => {
          expect($.find("form").length).toBe(1);
        });

        it("作成ボタン", () => {
          const $buttons = $.find("form button");
          expect($buttons.last().text()).toBe("作成");
        });
      });

      describe("未入力項目なしでサブミット", () => {
        beforeAll(() => {
          clickCreateButton($);

          setValue($, "strdate", "20191231");
          setValue($, "customer", "サンプル株式会社");
          setValue($, "from", "JR錦糸町");
          setValue($, "to", "JR東京駅");
          setValue($, "cost", "800");
          $.find("form").simulate("submit");
        });

        it("交通費作成関数が呼び出される", async () => {
          // TODO: useFormのhandleSubmitが非同期? 一定時間待つ必要がある(要調査)
          await wait();
          expect(spyCreate.mock.calls.length).toBe(1);
          expect(spyCreate.mock.calls[0][0]).toEqual({
            strdate: "20191231",
            customer: "サンプル株式会社",
            from: "JR錦糸町",
            to: "JR東京駅",
            cost: 800,
            projectId: "201108010001",
            usageId: "3",
            objectiveId: "2"
          });
        });
      });
    });

    describe("編集モーダル", () => {
      beforeAll(() => {
        $.find("tbody tr")
          .first()
          .find("button")
          .first()
          .simulate("click");
      });

      describe("表示", () => {
        it("編集フォーム", () => {
          expect($.find("form").length).toBe(1);
        });

        it("日付", () => {
          const $input = $.find(`input[name="strdate"]`);
          expect($input.length).toBe(1);
          expect($input.prop("defaultValue")).toBe("20190701");
        });

        it("プロジェクト", () => {
          expect($.find(`select[name="projectId"]`).length).toBe(1);
        });

        it("利用区分", () => {
          expect($.find(`select[name="usageId"]`).length).toBe(1);
        });

        it("目的区分", () => {
          expect($.find(`select[name="objectiveId"]`).length).toBe(1);
        });
        it("顧客先", () => {
          const $input = $.find(`input[name="customer"]`);
          expect($input.length).toBe(1);
          expect($input.prop("defaultValue")).toBe("XXXX株式会社");
        });
        it("乗車地", () => {
          const $input = $.find(`input[name="from"]`);
          expect($input.length).toBe(1);
          expect($input.prop("defaultValue")).toBe("JR 東京駅");
        });
        it("降車地", () => {
          const $input = $.find(`input[name="to"]`);
          expect($input.length).toBe(1);
          expect($input.prop("defaultValue")).toBe("JR 新宿駅");
        });
        it("コスト", () => {
          const $input = $.find(`input[name="cost"]`);
          expect($input.length).toBe(1);
          expect($input.prop("defaultValue")).toBe("777");
        });

        it("更新ボタン", () => {
          const $buttons = $.find("form button");
          expect($buttons.last().text()).toBe("更新");
        });

        it("モーダルを閉じる", () => {
          const $buttons = $.find("form button");
          $buttons.first().simulate("click");
          expect($.find("form").length).toBe(0);
        });
      });

      describe("未入力項目あり", () => {
        beforeAll(() => {
          $.find("tbody tr")
            .first()
            .find("button")
            .first()
            .simulate("click");
          $.find("form button")
            .last()
            .simulate("click");
        });

        it("更新サブミットされない", () => {
          expect(spyUpdate.mock.calls.length).toBe(0);
        });
      });

      describe("未入力項目なし", () => {
        beforeAll(() => {
          $.find("tbody tr")
            .first()
            .find("button")
            .first()
            .simulate("click");

          setValue($, "strdate", "20190901");
          setValue($, "customer", "サンプル株式会社");
          setValue($, "from", "JR 新宿駅");
          setValue($, "to", "JR 横浜駅");
          setValue($, "cost", "500");
          $.find("form").simulate("submit");
        });

        it("編集フォーム", () => {
          expect($.find("form").length).toBe(1);
        });

        it("更新関数が呼び出される", async () => {
          // TODO: useFormのhandleSubmitが非同期? 一定時間待つ必要がある(要調査)
          await wait();
          expect(spyUpdate.mock.calls.length).toBe(1);
          expect(spyUpdate.mock.calls[0][0]).toEqual({
            expenseId: "7980",
            strdate: "20190901",
            customer: "サンプル株式会社",
            from: "JR 新宿駅",
            to: "JR 横浜駅",
            cost: 500,
            projectId: "201108010001",
            usageId: "3",
            objectiveId: "2"
          });
        });
      });
    });

    describe("削除", () => {
      it("削除関数が呼び出される", () => {
        $.find("tbody tr")
          .first()
          .find("button")
          .last()
          .simulate("click");
        expect(spyDelete.mock.calls.length).toBe(1);
        expect(spyDelete.mock.calls[0][0]).toBe("7980");
      });
    });

    describe("作成モーダル(交通費テンプレート)", () => {
      beforeAll(() => {
        clickCreateFromTemplateButton($);
      });

      it("フォーム", () => {
        expect($.find("form").length).toBe(1);
      });

      it("日付", () => {
        const $input = $.find(`input[name="strdate"]`);
        expect($input.length).toBe(1);
        expect($input.prop("defaultValue")).toBe("");
      });

      it("テンプレート", () => {
        const $select = $.find(`select[name="templateId"]`);
        expect($select.length).toBe(1);
        expect($select.prop("defaultValue")).toBe("xxxx-yyyy");
      });

      describe("未入力項目なしでフォームサブミット", () => {
        beforeAll(() => {
          setValue($, "strdate", "20191001");
          $.find("form").simulate("submit");
        });

        it("交通費作成関数(テンプレート)が呼び出される", async () => {
          await wait();
          expect(spyCreateFromTemplate.mock.calls.length).toBe(1);
          expect(spyCreateFromTemplate.mock.calls[0]).toEqual([
            "xxxx-yyyy",
            "20191001"
          ]);
        });

        // Note: enzyme上だとform要素が残る 要調査
        // it("モーダルが閉じられる", async () => {
        //   await wait();
        //   expect($.find("form").length).toBe(0);
        // });
      });
    });
  });
});
