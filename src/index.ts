// import { question as q } from './libs/types'
import * as vscode from 'vscode'
import { createValiteFunc } from './utils/curry'
export async function infInput(questions: question[]): Promise<resultObj> {
  return new Promise(async (reslove, reject) => {
    try {
createValiteFunc
      let result: resultObj = {};
      // let currt = 
      for (const question of questions) {
        const { name, message, when, default: defaultVale, prefix, suffix } = question
        const con = typeof when === 'function' ? when(result) : when || false
        if (!con) continue;
        const validateInput = createValiteFunc<string, resultObj ,valited>(question.validate, result)
        const value = typeof defaultVale === 'function' ? defaultVale(result) : defaultVale || ''
        const placeHolder = typeof message === 'function' ? message(result) : message || ''
        result[name] = (prefix || "") + await vscode.window.showInputBox({
          validateInput,
          placeHolder,
          value: value as string
        }) as string + (suffix || "")
      }
      reslove(result);
    }
      catch(e) {
        reject(e);
      }
  })
}

export function createPick() {
  return vscode.window.showQuickPick(['aaaa', 'bbbb'])
}

export type valited = string | undefined | null | Thenable<string | undefined | null>

export type inputType = 'input' | 'number' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox'

export type resultObj = Record<string, result>

export type result = String | Number | Boolean | Array<unknown>

export type handleResultFunc<T> = (results: resultObj) => T

export type Separator = string

export type choices = Array<number | string>

export type validateFunc = (input: string | number, results: resultObj) => valited

export type filterFunc = (input: string | number) => string | number

export interface question {
  type: inputType,
  name: string, // done
  message?: string | handleResultFunc<string>, // done
  default: string | number | boolean | Array<unknown> | handleResultFunc<result> // done
  choices: choices | handleResultFunc<choices>
  // TODO: 这里choices里的separator 是否要添加? 待处理
  validate: validateFunc, // done
  when: handleResultFunc<boolean> | boolean //done
  prefix?: string // done
  suffix?: string, // done
  askAnswered: boolean,
  loop: boolean
}