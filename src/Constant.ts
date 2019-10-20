import { Brick } from "./Brick";
import { UniqueId, TowerPrimitive } from "./Types";
import { ITowerType, ITowerTypeError, t, NUM, STR, BOOL } from "./ITowerType";
import {isNumber, isString, isBoolean, isEqual} from "lodash";

interface IProps {
  uniqueId?: UniqueId;
  value: TowerPrimitive;
}

export class Constant extends Brick {
  public static fromJSON(inJson: any): Constant {
    return new Constant(inJson);
  }

  public value: TowerPrimitive;

  constructor(props: IProps) {
    super(props.uniqueId);
    this.value = props.value;
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("constant");
    json.value = this.value;
    return json;
  }

  public typeErrorForExpectedType(type: ITowerType): ITowerTypeError|null {
    let actualType;
    if (isNumber(this.value)) {
      actualType = t(NUM);
    } else if (isString(this.value)) {
      actualType = t(STR);
    } else if (isBoolean(this.value)) {
      actualType = t(BOOL);
    } else {
      throw new Error("Couldn't deduce type for value: " + this.value);
    }
    if (isEqual(type, actualType)) {
      return null;
    } else {
      return {
        expected: type,
        was: actualType
      }
    }
  }
}
