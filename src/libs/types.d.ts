export type inputType = 'input' | 'number' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox'

export type resultObj = Record<string, result>

export type result = String | Number | Boolean | Array<unknown>

export type handleResultFunc<T> = (results: resultObj) => T

export type Separator = string

export type choices = Array<number | string>

export type validateFunc = (input: string | number, results: resultObj) => boolean | string

export type filterFunc = (input: string | number) => string | number

export interface question {
  type: inputType,
  name: string,
  message: string | handleResultFunc<string>,
  default: string | number | boolean | Array<unknown> | handleResultFunc<result>
  choices: choices | handleResultFunc<choices>
  // TODO: 这里choices里的separator 是否要添加? 待处理
  validate: validateFunc,
  filter: filterFunc,
  when: handleResultFunc<boolean> | boolean
  pageSize: number,
  prefix: string
  suffix: string,
  askAnswered: boolean,
  loop: boolean
}