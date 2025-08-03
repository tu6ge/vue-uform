import { expect, test } from "vitest";
import { parseValidations } from "../src/validation";

test("test one validation", () => {
  expect(parseValidations("required")).toStrictEqual([
    { name: "required", params: [] },
  ]);
});

test("test more validation", () => {
  expect(parseValidations("required|number")).toStrictEqual([
    { name: "required", params: [] },
    { name: "number", params: [] },
  ]);
});

test("test more validation and with params", () => {
  expect(parseValidations("required|number|length:10,20")).toStrictEqual([
    { name: "required", params: [] },
    { name: "number", params: [] },
    { name: "length", params: ["10", "20"] },
  ]);
});
