import * as vscode from 'vscode';
import { result, valited } from '../index';
export interface inputConfig {
  placeHolder: string,
  value: result,
  validateInput: (input: string) => valited
}

export function createInput(config: inputConfig) {
    const { placeHolder, value, validateInput } = config;
    return new Promise((reslove) => {
        vscode.window.showInputBox({
            validateInput,
            placeHolder,
            value: value as string
        }).then(res => reslove(res));
    });
}