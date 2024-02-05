import { Endpoint } from "shared/utils/endpoints";
import { HTTP_CLIENT } from "../utils/interceptor";

const addCard = (params: any) => {
    const formBody:any = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formBody.append(key,value)
    }
  return HTTP_CLIENT.post(Endpoint.card.addCard, formBody);
};
const getAllCard = ()=>{
  return HTTP_CLIENT.get(Endpoint.card.getAllCard);
}
const makeDefaultCard = (params: any)=>{
  const formBody:any = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formBody.append(key,value)
    }
  return HTTP_CLIENT.post(Endpoint.card.defaultCard,formBody);
}
const removeCard = (params: any)=>{
  const formBody:any = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formBody.append(key,value)
  }
  return HTTP_CLIENT.post(Endpoint.card.removeCard,formBody);
}
export {
    addCard,
    getAllCard,
    makeDefaultCard,
    removeCard
}