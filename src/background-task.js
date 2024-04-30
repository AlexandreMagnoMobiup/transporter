import {
  if_exists,
  create_responsible,
  create_company,
  create_documents,
  create_logistic,
  linkToBase64
} from "./integration.js";

async function processItems(items) {
  for (const item of items) {
    if (!item.cpf_cnpj) {
      continue; 
    }
    const exists = await if_exists(item.cpf_cnpj);
    if (exists) {
      continue;
    }

    await create_responsible(transformToResponsible(item))

    await Promise.all([
      create_company(transformToCompany(item)),
      create_documents(await transformToDocument(item)),
      create_logistic(transformToLogistic(item))
    ]);

    process.send('item-done');
  }

  return results;
}

process.on("message", async (items) => {
  await processItems(items);
});


export function transformToResponsible(item) {
  let firstName = item.responsible_name;
  let lastName = "";
  let nameParts = item.responsible_name || item.company_social_name
  nameParts = nameParts.split(' ');
  if (nameParts.length > 1) {
    firstName = nameParts[0];
    lastName = nameParts[nameParts.length - 1];
  }
   return {
      "cpfCnpj": item.cpf_cnpj,
      "responsible": {
          "cpfPartner": item.cpf_socio,
          "firstName": firstName,
          "lastName": lastName,
          "birthday": item.responsible_birthday,
          "email": item.responsible_email,
          "password": "mudar123",
          "cellphone": item.responsible_phone || '999999999',
          "comercialPhone": item.responsible_cellphone
      }
    }
}

export function transformToCompany(item) {
  if(!item.company_cep) return false
  return {
      "cpfCnpj": item.cpf_cnpj,
      "company": {
          "name": item.company_social_name,
          "tradingName": item.company_fantasy_name || '-',
          "cnpj": item.cpf_cnpj.length > 11 ? item.cpf_cnpj : '',
          "businessKey": item.key || '-',
          "address": {
              "postalCode": item.company_cep,
              "street": item.company_address || '-',
              "neighborhood": item.company_neighborhood || '-',
              "city": item.company_city || '-',
              "state": item.company_state || '-',
              "streetNumber": item.company_address_number || '-',
              "complement": item.company_address_complement || '-',
              "reference": item.responsible_address_reference_point || '-',
          }
      },
    }
}


export async function transformToDocument(item) {
  if(!item.foto_documento) return false
  return {
    "cpfCnpj": item.cpf_cnpj,
    "proof": {
      "identification": await linkToBase64(item.foto_documento),
      "addressProof": await linkToBase64(item.foto_endereco),
      "storeFront" : await linkToBase64(item.foto_estabelecimento_fachada),
      "storeInterior": await linkToBase64(item.foto_estabelecimento_interior)
    }
  }
}

export function transformToLogistic(item) {
  if(!item.atendimento) return false
  return {
    "cpfCnpj": item.cpf_cnpj,
    "finished" : true,
    "logistic": {
        "attendanceMode": adaptAttendanceMode(item.atendimento),
        "openingStatus": "open",
        "availableDays": adaptAvailableDays(item.dia_semana),
        "availableShifts": adaptAvailableShifts(item.turno)
    }
  }
}

export function adaptAttendanceMode(atendimento) {
  switch(atendimento) {
    case 'telefone':
      return 'phone';
    case 'digital':
      return 'digital';
    case 'presencial':
      return 'in-person';
    default:
      return 'telefone';
  }
}

export function adaptAvailableDays(dia_semana) {
  if (!dia_semana) {
    return [];
  }
  const dias = dia_semana.split('/');
  const diasIngles = {
    'SEG': 'MON',
    'TER': 'TUE',
    'QUA': 'WED',
    'QUI': 'THU',
    'SEX': 'FRI',
    'SAB': 'SAT',
    'DOM': 'SUN'
  };
  
  return dias.map(dia => diasIngles[dia]);
}

export function adaptAvailableShifts(turno) {
  if (!turno) {
    return [];
  }
  const turnos = turno.split('/');
  const turnosIngles = {
    'MANHA': 'MORNING',
    'TARDE': 'AFTERNOON',
    'NOITE': 'NIGHT'
  };
  
  return turnos.map(turno => turnosIngles[turno]);
}
