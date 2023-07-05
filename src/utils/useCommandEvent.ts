import mitt from "mitt";

type Events = {
    commandPaletteOpen: any;
    commandPaletteClose: any;
    openCommandPalette: string;
    closeCommandPalette: boolean;
    select: any;
    dialogKeyDown: KeyboardEvent;
    focusInput: any;
};

const emitter = mitt<Events>();

export function useCommandEvent() {
    return emitter;
}
