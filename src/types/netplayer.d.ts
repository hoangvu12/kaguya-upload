import * as netplayer from "netplayer";
import { SubtitleFormat } from "./core";

declare module "netplayer/dist/types" {
  export interface Subtitle {
    file: string;
    lang: string;
    language: string;
    format: SubtitleFormat;
  }
}
