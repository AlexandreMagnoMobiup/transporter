import axios from "axios";


export async function if_exists(document) {
  try {
    const response = await axios.get(
      url + `/responsible-data?username=${document}`
    );
    const { status } = response.data;
    return status;
  } catch (error) {
    return false;
  }
}


export function create_responsible(data) {
    if (!data) {
      return Promise.resolve({ message: 'Skipping responsible creation (data is empty or false)' });
    }
    const url = process.env.MICROSERVICE_REGISTER_INTEGRATION_URL;
    return axios.post(
      url + `/responsible?fromKonnect=true`,data
    );
}

export function create_company(data){
    if (!data) {
      return Promise.resolve({ message: 'Skipping responsible creation (data is empty or false)' });
    }
    const url = process.env.MICROSERVICE_REGISTER_INTEGRATION_URL;
    return axios.post(
      url + `/company`,data
    );
}

export function create_documents(data) {
    if (!data) {
      return Promise.resolve({ message: 'Skipping responsible creation (data is empty or false)' });
    }
    const url = process.env.MICROSERVICE_REGISTER_INTEGRATION_URL;
    return axios.post(
      url + `/document`,data
    );
}

export function create_logistic(data) {
    if (!data) {
      return Promise.resolve({ message: 'Skipping responsible creation (data is empty or false)' });
    }
    const url = process.env.MICROSERVICE_REGISTER_INTEGRATION_URL;
    return axios.post(
      url + `/logistic`,data
    );
}

export async function linkToBase64(link) {
  try {
      const response = await axios.get(link, { responseType: 'arraybuffer' });
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return base64;
  } catch (error) {
      return ''
  }
}


