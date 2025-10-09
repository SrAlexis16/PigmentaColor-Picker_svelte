import { writable } from "svelte/store";
import chroma from "chroma-js" 

const defaultColor = chroma("#2C4351");
export const currentColor = writable(defaultColor);