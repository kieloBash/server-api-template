import { randomInt } from "crypto";

export function generateRandomToken() {
    return randomInt(100000, 1000000).toString();
}