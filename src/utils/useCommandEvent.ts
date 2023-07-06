import mitt from "mitt";
import { CommandItem } from "@/types";

type Events = {
    commandPaletteOpen: undefined;
    commandPaletteClose: undefined;
    openCommandPalette: string | undefined;
    closeCommandPalette: boolean | undefined;
    select: CommandItem;
    dialogKeyDown: KeyboardEvent;
    focusInput: undefined;
};

const emitter = mitt<Events>();

export function useCommandEvent() {
    return emitter;
}
