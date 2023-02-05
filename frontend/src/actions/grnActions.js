import axios from 'axios'

export const listGrn = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token.queryKey[1]}`,
    },
  }

  const { data } = await axios.get(`/api/probatch`, config)

  return data
}

export const createGrn = async (product) => {
  console.log(product)

  const config = {
    headers: {
      Authorization: `Bearer ${product.token}`,
    },
  }

  delete product.token

  return await axios.post(`/api/probatch`, product, config)
}


export const updateGrn = async (product) => {
  console.log(product)

  const config = {
    headers: {
      Authorization: `Bearer ${product.token}`,
    },
  }

  delete product.token

  return await axios.put(`/api/probatch`, product, config)
}


export const updateProBatches = async (batch) => {
  console.log(batch.token)

  const config = {
    headers: {
      Authorization: `Bearer ${batch.token}`,
    },
  }

  delete batch.token

  return await axios.put(`/api/probatch/${batch.id}`, batch, config)
}


export const listproductMAatNames = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token.queryKey[1]}`,
    },
  }

  const { data } = await axios.get(`/api/product/allnames`, config)

  return data
}