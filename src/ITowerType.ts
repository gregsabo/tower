type TypeName = string | number;

export interface ITowerType {
  typeName: TypeName;
  typeParameters?: TypeName[];
}


export const NUM = "number";
export const STR = "string";
export const BOOL = "boolean";
export const LIST = "list";
export const UNION = "union";
export const FUNC = "function";

export function t(typeName: TypeName, parameters?: TypeName[]) {
  return {
    typeName,
    typeParameters: parameters
  };
}

export interface ITowerTypeError {
  expected: ITowerType,
  was: ITowerType
}