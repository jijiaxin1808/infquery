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

export function createPicker<T extends QuickPickItem>(item: T[] | string[], config: pickerConfig) {
    const { placeHolder } = config;
    if(!item.length) return;
    let items: QuickPickItem[];
    if(isStringArray(item)) {
        items = item.map(label => ({label}));
    }
    return new Promise((reslove) => {
        window.showQuickPick(items as  T[], {
            placeHolder,
            ignoreFocusOut: true
        }).then(res => reslove(res));
    });
}