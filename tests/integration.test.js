import dotenv from "dotenv";
import {
  if_exists,
  create_responsible,
  create_company,
  create_documents,
  create_logistic,
  linkToBase64
} from "../src/integration.js";

import {
  transformToResponsible,
  transformToCompany,
  transformToDocument,
  transformToLogistic
} from "../src/background-task";

const testData = require("./test2.json");
const testData1 = require("./test3.json");
dotenv.config();

describe("Integration tests", () => {


  it("should the person responsible is successfully registered", async () => {
    for (let i = 0; i < testData.length; i++) {
      const item = testData[i];
      if (!item.cpf_cnpj) continue;
      const exists = await if_exists(item.cpf_cnpj);
      console.log(item.cpf_cnpj);
      console.log(exists);
      if (!exists) {
        create_responsible(transformToResponsible(item)).then(
          (resp) =>  {
            // Assert if the response status is 200 for create_responsible
            expect(resp.status).toBe(201);
            create_company(transformToCompany(item)).then((resp) =>  {
              // Assert if the response status is 200 for create_company
              expect(resp.status).toBe(201);
            }).catch((err) => console.log(err))
            create_documents(transformToDocument(item)).then((resp) =>  {
              // Assert if the response status is 200 for create_documents
              expect(resp.status).toBe(200);
            }).catch((err) => console.log(err))
            create_logistic(transformToLogistic(item)).then((resp) =>  {
              // Assert if the response status is 200 for create_logistic
              expect(resp.status).toBe(201);
            }).catch((err) => console.log(err))
        }).catch((err) => console.log(err))
      }
    }
  });

  it("should the person responsible is successfully registered without logistic", async () => {
      const item = testData1;
      const exists = await if_exists(item.cpf_cnpj);
      console.log(item.cpf_cnpj);
      console.log(exists);
      if (!exists) {
        create_responsible(transformToResponsible(item)).then(
          (resp) =>  {
            // Assert if the response status is 200 for create_responsible
            expect(resp.status).toBe(201);
            create_company(transformToCompany(item)).then((resp) =>  {
              // Assert if the response status is 200 for create_company
              expect(resp.status).toBe(201);
            }).catch((err) => expect(resp.status).toBe(201))
            create_documents(transformToDocument(item)).then((resp) =>  {
              // Assert if the response status is 200 for create_documents
              expect(resp.status).toBe(200);
            }).catch((err) => expect(resp.status).toBe(201))
            create_logistic(transformToLogistic(item)).then((resp) =>  {
              // Assert if the response status is 200 for create_logistic
              expect(resp.status).toBe(201);
            }).catch((err) => expect(resp.status).toBe(201))
        }).catch((err) => expect(resp.status).toBe(201))
      }
    
  });

  it("should the link is converted to base64", async () => {
    const result = await linkToBase64("https://srefrescos-dev.s3.amazonaws.com/public/files/uploads/foto_endereco_08634148858.jpg")
    expect(result).toBe("");
  });


});
