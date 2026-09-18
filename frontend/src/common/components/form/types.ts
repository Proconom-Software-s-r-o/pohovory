export interface SelectOption<TKey extends string | number = number> {
    key: TKey;
    label: string;
}
