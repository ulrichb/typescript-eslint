import rule from '../../src/rules/require-await';
import { RuleTester, getFixturesRootDir } from '../RuleTester';

const rootDir = getFixturesRootDir();

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: rootDir,
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
});

const noAwaitFunctionDeclaration: any = {
  message: "Async function 'numberOne' has no 'await' expression.",
};

const noAwaitFunctionExpression: any = {
  message: "Async function has no 'await' expression.",
};

const noAwaitAsyncFunctionExpression: any = {
  message: "Async arrow function has no 'await' expression.",
};

ruleTester.run('require-await', rule, {
  valid: [
    {
      // Non-async function declaration
      code: `function numberOne(): number {
        return 1;
      }`,
    },
    {
      // Non-async function expression
      code: `const numberOne = function(): number {
        return 1;
      }`,
    },
    {
      // Non-async arrow function expression
      code: `const numberOne = (): number => 1;`,
    },
    {
      // Async function declaration with await
      code: `async function numberOne(): Promise<number> {
        return await 1;
      }`,
    },
    {
      // Async function expression with await
      code: `const numberOne = async function(): Promise<number> {
        return await 1;
      }`,
    },
    {
      // Async arrow function expression with await
      code: `const numberOne = async (): Promise<number> => await 1;`,
    },
    {
      // Async function declaration with promise return
      code: `async function numberOne(): Promise<number> {
        return Promise.resolve(1);
      }`,
    },
    {
      // Async function expression with promise return
      code: `const numberOne = async function(): Promise<number> {
        return Promise.resolve(1);
      }`,
    },
    {
      // Async function declaration with async function return
      code: `async function numberOne(): Promise<number> {
        return getAsyncNumber(1);
      }
      async function getAsyncNumber(x: number): Promise<number> {
        return Promise.resolve(x);
      }`,
    },
    {
      // Async function expression with async function return
      code: `const numberOne = async function(): Promise<number> {
        return getAsyncNumber(1);
      }
      const getAsyncNumber = async function(x: number): Promise<number> {
        return Promise.resolve(x);
      }`,
    },
  ],

  invalid: [
    {
      // Async function declaration with no await
      code: `async function numberOne(): Promise<number> {
        return 1;
      }`,
      errors: [noAwaitFunctionDeclaration],
    },
    {
      // Async function expression with no await
      code: `const numberOne = async function(): Promise<number> {
        return 1;
      }`,
      errors: [noAwaitFunctionExpression],
    },
    {
      // Async arrow function expression with no await
      code: `const numberOne = async (): Promise<number> => 1;`,
      errors: [noAwaitAsyncFunctionExpression],
    },
  ],
});
