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
    if (!item.length) return true;
    return typeof item[0] === 'string';
}

export function createPicker<T extends QuickPickItem>(item: T[] | string[], config: pickerConfig) {
    const { placeHolder } = config;
    let items: QuickPickItem[] =[];
    if(isStringArray(item)) {
        items = item.map(label => ({label}));
    } else { 
        items = item; 
    }
    return new Promise((reslove) => {
        window.showQuickPick(items, {
            placeHolder,
            ignoreFocusOut: true
        }).then(res => reslove(res));
    });
}