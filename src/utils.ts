export const saveDataOffline = (key: string, data: never) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getDataOffline = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};
