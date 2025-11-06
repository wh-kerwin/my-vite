import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import loginModule from "./mock/login";
// import tableModule from './mock/table'
// import cardModule from './mock/card'
// import workModule from './mock/work'
// import UserMoudle from './mock/systemUser'

export function setupProdMockServer() {
  createProdMockServer([
    ...loginModule,
    // ...tableModule,
    // ...cardModule,
    // ...workModule,
    // ...UserMoudle
  ]);
}