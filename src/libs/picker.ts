import { result, valited } from '../index';
import { QuickPickItem, window } from 'vscode';
export interface inputConfig {
  placeHolder: string,
  value: result,
  validateInput: (input: string) => valited
}

export interface pickerConfig {
  placeHolder: string,
}

export function isStringArray(item: QuickPickItem[] | string[]): item is string[] {
    return typeof item[0] === 'string';
}

export function createPicker(item: QuickPickItem[] | string[], config: pickerConfig) {
    const { placeHolder } = config;
    if(!item.length) return;
    if(isStringArray(item)) {
        item = item.map(label => ({label}));
    }
    return new Promise((reslove) => {
        window.showQuickPick(item as  QuickPickItem[], {
            placeHolder,
            ignoreFocusOut: true
        }).then(res => reslove(res));
    });
}