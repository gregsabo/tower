import { Brick } from "./Brick";
import { UniqueId, TowerPrimitive } from "./Types";

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
}
