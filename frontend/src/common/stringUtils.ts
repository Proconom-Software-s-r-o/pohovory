import { Maybe } from './types/typeUtils';

/**
 * Je řetězec vyplněný (není null, undefined ani jen mezery)?
 * @param str kontrolovaný řetězec
 * @returns true pokud řetězec něco obsahuje
 */
export const isValid = (str: Maybe<string>): str is string => {
    if (!str) return false;

    return str.trim().length > 0;
};

/**
 * Zkrátí text na zadanou délku a doplní tři tečky.
 * @param str zkracovaný text
 * @param maxLength maximální délka výsledku včetně teček
 * @returns zkrácený text
 */
export const truncate = (str: Maybe<string>, maxLength: number): string => {
    if (!isValid(str)) return '';

    return str.length <= maxLength ? str : `${str.slice(0, maxLength - 1).trimEnd()}…`;
};
