
import { Base64 } from 'js-base64';
export type Timestamp = [number, number];

export interface Hashed<T> {
  hash: string;
  content: T;
}
export function deserializeHash(hash: string): Uint8Array {
  return Base64.toUint8Array(hash.slice(1));
}

export function serializeHash(hash: Uint8Array): string {
  return `u${Base64.fromUint8Array(hash, true)}`;
}

export function millisToTimestamp(millis: number): Timestamp {
  const secs = Math.floor(millis / 1000);
  const nanos = (millis % 1000) * 1000;
  return [secs, nanos];
}

export function timestampToMillis(timestamp: Timestamp): number {
  return timestamp[0] * 1000 + Math.floor(timestamp[1] / 1000);
}

export function now(): Timestamp {
  return millisToTimestamp(Date.now());
}

export type Dictionary<T> = { [key: string]: T };
