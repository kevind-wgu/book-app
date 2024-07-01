export function findById<T extends {id: string}>(objs : T[], id: string) : T | null {
  var found;
  if (objs) {
    found = objs.find(o => o.id === id);
  }
  return found ? found : null;
}

export function keyById<T extends {id: string}>(objs : T[]) : {[key: string]: T} {
  if (!objs) {
    return {};
  }
  return objs.reduce((obj, value) => {
    return {...obj, [value.id]: value};
  }, {});
}