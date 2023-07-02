import mitt from "mitt";

const emitter = mitt();

export function useCommandEvent() {
    return emitter;
}
