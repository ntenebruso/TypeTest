export interface CommandListItem {
    type: "list";
    value: string;
    index: number;
    dataset: DOMStringMap;
}

export interface CommandInputItem {
    type: "input";
    value: string;
}

export type CommandItem = CommandListItem | CommandInputItem;
