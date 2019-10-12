export interface IMaskItem {
  // regexp placeholder
  str?: string;
  regexp?: RegExp;

  // exact char
  char?: string;
}

export interface IMaskItemsMap {
  [key: string]: IMaskItem;
}
