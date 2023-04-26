export function userSort(order: any, direction: any, userList: []) {
  if (direction === "asc") {
    return userList.sort((a: any, b: any) => a.order - b.order);
  } else if (direction === "desc") {
    return userList.sort((a: any, b: any) => a.orderBy + b.orderBy);
  }
  console.log(order);
}
