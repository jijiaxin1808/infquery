/* eslint-disable no-case-declarations */
import { createValiteFunc } from './utils/curry';
import { createInput } from './utils/input';
import { createPicker } from './utils/picker';
import { QuickPickItem } from 'vscode';
export async function infInput<T extends QuickPickItem>(questions: question<T>[]): Promise<resultObj> {
    return new Promise(async (reslove, reject) => {
        try {
            // 返回给使用者的result
            const result: resultObj = {};
            for (const question of questions) {

                // 获取question的参数
                const { name, message, when, default: defaultVale, prefix, suffix } = question;

                // 当when返回true时，跳过当前问题
                if (typeof when === 'function' ? when(result) : when || !when) continue;

                // 获取初始值
                const value = typeof defaultVale === 'function' ? defaultVale(result) : defaultVale || '';

                // 获取placeholder
                const placeHolder = typeof message === 'function' ? message(result) : message || '';

                // 当前问题答案
                let answer = null;

                switch (question.type) {
                // 如果是input类型
                case 'input' : 
                    const { validate } = question;
                    // 这里是为了处理vscode的validater的格式（vscode的参数只有一个string），用到了一个二层的curry函数
                    const validateInput = validate ? createValiteFunc<string, resultObj ,valited>(validate, result) : undefined;
                    answer =  await createInput({
                        validateInput,
                        placeHolder,
                        value: String(value)
                    });
                    break;
                // 如果是picker类型
                case 'list': 
                    const { choices } = question;
                    if (choices === undefined) throw new Error('当类型为list时, 请填写choices');
                    const items =Array.isArray(choices) ? choices : choices(result);
                    answer =  await createPicker<T>(items,{
                        placeHolder
                    });
                    break;
                default: 
                }
                if(typeof answer === 'string') {
                    result[name] = (prefix || "") + answer + (suffix || "");
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

export type choices<T extends QuickPickItem> = string[] | T[]

export type validateFunc = (input?: string, results?: resultObj) => valited

export type filterFunc = (input: string | number) => string | number

export type question<T extends QuickPickItem> = inputQuestion | PickerQuestion<T>

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
export interface PickerQuestion<T extends QuickPickItem> extends  baseQuestion {
    type: 'list',
    choices: choices<T> | handleResultFunc<choices<T>>
}