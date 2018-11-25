import { makeUniqueId } from "./MakeUniqueId";

export default function makeType(name: string, fields: string[], methods: any) {
  methods.create = (obj: any) => {
    if (!obj) {
      obj = {};
    }
    for (const field of fields) {
      if (obj[field] === undefined) {
        throw new Error(
          `Did not pass required field ${field} when creating type ${name}.`
        );
      }
    }
    (obj.types = [name]), (obj.uniqueId = makeUniqueId);
    return obj;
  };

  methods.describes = (inObject: any) => {
    return (
      inObject &&
      inObject.types &&
      Array.isArray(inObject.types) &&
      inObject.types.indexOf(name) > -1
    );
  };

  methods.name = name;
  return methods;
}
