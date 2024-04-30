// tests/background-task.test.js
import {
  transformToResponsible,
  transformToCompany,
  transformToDocument,
  transformToLogistic,
  adaptAttendanceMode,
  adaptAvailableDays,
  adaptAvailableShifts,
} from "../src/background-task";

const testData = require("./teste1.json");

describe("Background tests", () => {
  it("should transform data to responsible format", () => {
    const item = testData;

    const result = transformToResponsible(item);

    expect(result).toEqual({
      cpfCnpj: "08634148858",
      responsible: {
        cpfPartner: "987654321",
        firstName: "John",
        lastName: "Doe",
        birthday: "1968-07-01",
        cellphone: "999999999",
        comercialPhone: "11986532465",
        cpfPartner: "",
        email: "ruy@visioweb.com.br",
        firstName: "Ruy",
        lastName: "Pereira",
        password: "mudar123",
      },
    });
  });

  it("should transform data to company format", () => {
    const item = testData;

    const result = transformToCompany(item);

    expect(result).toEqual({
      cpfCnpj: "08634148858",
      company: {
        address: {
          city: "São Paulo",
          complement: "",
          neighborhood: "Jardim Duprat",
          postalCode: "05853310",
          reference: null,
          state: "SP",
          street: "Rua Holda Botto Malanconi",
          streetNumber: "414",
        },
        businessKey: "594",
        name: "Ruy Ilkal de Lima Pereira",
        tradingName: "-",
      },
    });
  });


  it("should transform data to document format", async () => {
    const item = testData;

    const result = await transformToDocument(item);

    expect(result).toEqual({
      cpfCnpj: "08634148858",
      proof: {
        addressProof: '',
        identification: '',
        storeFront: '',
        storeInterior: ''
      }
    });
  });

  it("should transform data to logistic format", () => {
    const item = testData;

    const result = transformToLogistic(item);

    expect(result).toEqual({
      cpfCnpj: "08634148858",
      finished: true,
      logistic: {
        attendanceMode : "digital",
        openingStatus : "open",
        availableDays : ["MON", "TUE", "WED", "THU", "FRI", "SAT","SUN"],
        availableShifts : ["MORNING"]
      }
    });
  });


  it("should adapt attendance mode correctly", () => {
    expect(adaptAttendanceMode("telefone")).toBe("phone");
    expect(adaptAttendanceMode("digital")).toBe("digital");
    expect(adaptAttendanceMode("presencial")).toBe("in-person");
    expect(adaptAttendanceMode("outro")).toBe("");
  });

  it("should adapt available days correctly", () => {
    expect(adaptAvailableDays("SEG/TER/QUA")).toEqual(["MON", "TUE", "WED"]);
    expect(adaptAvailableDays("SAB/DOM")).toEqual(["SAT", "SUN"]);
    expect(adaptAvailableDays("")).toEqual([]);
  });

  it("should adapt available shifts correctly", () => {
    expect(adaptAvailableShifts("MANHA/TARDE")).toEqual([
      "MORNING",
      "AFTERNOON",
    ]);
    expect(adaptAvailableShifts("NOITE")).toEqual(["NIGHT"]);
    expect(adaptAvailableShifts("")).toEqual([]);
  });

});
