import { v1 as uuid } from "uuid";

export const makeUniqueId = () => {
  return uuid();
};
