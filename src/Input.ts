import { Brick } from "./Brick";
import { UniqueId } from "./Types";

interface IProps {
  uniqueId?: UniqueId;
  inputKey: string;
}

export class Input extends Brick {
  public static fromJSON(inJson: any): Input {
    return new Input(inJson);
  }

  public inputKey: string;

  constructor(props: IProps) {
    super(props.uniqueId);
    this.inputKey = props.inputKey;
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("input");
    json.inputKey = this.inputKey;
    return json;
  }
}
