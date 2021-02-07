/* eslint-disable no-case-declarations */
import { createValiteFunc } from './utils/curry';
import { createInput } from './libs/input';
import { createPicker } from './libs/picker';
import { QuickPickItem } from 'vscode';
export async function infInput(questions: question[]): Promise<resultObj> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (reslove, reject) => {
        try {
            const result: resultObj = {};
            for (const question of questions) {
                const { name, message, when, default: defaultVale, prefix, suffix } = question;

                const con = typeof when === 'function' ? when(result) : when || true;
                if (!con) continue;

                const value = typeof defaultVale === 'function' ? defaultVale(result) : defaultVale || '';
                const placeHolder = typeof message === 'function' ? message(result) : message || '';
                let res = null;
                
                switch (question.type) {
                case 'input' : 
                    const { validate } = question;
                    const validateInput = validate ? createValiteFunc<string, resultObj ,valited>(validate, result) : () => '';
                    res =  await createInput({
                        validateInput,
                        placeHolder,
                        value: value as string
                    });
                    break;
                case 'list': 
                    const { choices } = question;
                    if (choices === undefined) throw new Error('当类型为list时, 请填写choices');
                    const items =Array.isArray(choices) ? choices : choices(result);
                    res =  await createPicker(items,{
                        placeHolder
                    });
                    break;
                default: 
                }

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

export type choices = string[] | QuickPickItem[]

export type validateFunc = (input?: string, results?: resultObj) => valited

export type filterFunc = (input: string | number) => string | number

export type question = inputQuestion | PickerQuestion

export interface baseQuestion {
    when?: handleResultFunc<boolean> | boolean
    prefix?: string
    suffix?: string,
    default?: string | number | boolean | Array<unknown> | handleResultFunc<result>,
    message?: string | handleResultFunc<string>,
    name: string,
}

export interface inputQuestion extends  baseQuestion {
    type: 'input',
    validate?: validateFunc,
}
export interface PickerQuestion extends  baseQuestion {
    type: 'list',
    choices: choices | handleResultFunc<choices>
}