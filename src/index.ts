import { createValiteFunc } from './utils/curry';
import { createInput } from './libs/input';
export async function infInput(questions: question[]): Promise<resultObj> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (reslove, reject) => {
        try {
            const result: resultObj = {};
            for (const question of questions) {
                const { name, message, when, default: defaultVale, prefix, suffix, validate } = question;
                const con = typeof when === 'function' ? when(result) : when || true;
                if (!con) continue;
                const validateInput = validate ? createValiteFunc<string, resultObj ,valited>(validate, result) : () => '';
                const value = typeof defaultVale === 'function' ? defaultVale(result) : defaultVale || '';
                const placeHolder = typeof message === 'function' ? message(result) : message || '';
                const  res =  await createInput({
                    validateInput,
                    placeHolder,
                    value: value as string
                });
                if (res !== undefined) {
                    result[name] = (prefix || "") + res + (suffix || "");
                }
            }
            reslove(result);
        }
        catch(e) {
            reject(e);
        }
    });
}

export type valited = string | undefined | null | Thenable<string | undefined | null>

export type inputType = 'input' | 'number' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox'

export type resultObj = Record<string, result>

export type result = string | number | boolean | Array<unknown>

export type handleResultFunc<T> = (results: resultObj) => T

export type Separator = string

export type choices = Array<number | string>

export type validateFunc = (input?: string, results?: resultObj) => valited

export type filterFunc = (input: string | number) => string | number

export interface question {
  type: inputType,
  name: string,
  message?: string | handleResultFunc<string>,
  default?: string | number | boolean | Array<unknown> | handleResultFunc<result>
  choices?: choices | handleResultFunc<choices>
  validate?: validateFunc,
  when?: handleResultFunc<boolean> | boolean
  prefix?: string
  suffix?: string,
  // askAnswered: boolean,
  // loop: boolean
}