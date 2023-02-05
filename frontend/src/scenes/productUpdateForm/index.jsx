import {
  Box,
  Button,

  InputLabel,

  TextField,
} from '@mui/material'

import useMediaQuery from '@mui/material/useMediaQuery'

import AdminHeader from '../../components/AdminHeader'
import { useState } from 'react'
import {  useSelector } from 'react-redux'

import { getProductById } from '../../actions/productActions'
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { useQuery, useMutation } from 'react-query'
import { updateProduct } from '../../actions/productActions'
import { toast } from 'react-toastify'

const UserUpdateForm = () => {
  const location = useLocation()

  const { id } = useParams()
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    re_order_level: '',
    description: '',
  })

  const users = useSelector((state) => state.userLogin)
  const { userInfo } = users

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useQuery(['product', userInfo.token, id], getProductById)

  const addProductMutation = useMutation(updateProduct, {
    onSuccess: () => {
      toast.success('Product Added!')

      if (location.search.split('=')[1] === 'out') {
        navigate('/admin/outproduct')
      } else {
        navigate('/admin/product')
      }
    },
  })


  let content
  if (isLoading) {
    return <p>Loading</p>
  } else if (isError) {
    return <p>{error.message}</p>
  } else {
    content = product.data
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addProductMutation.mutate({ ...form, token: userInfo.token, id })
  }

  const change = (e) => {
    if (!e.target.files) {
      setForm((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }
  }

  return (
    <Box m='20px'>
      <AdminHeader
        title='UPDATE PRODUCT'
        subtitle='Update a existing product'
      />

      <form onSubmit={handleSubmit}>
        <Box
          display='grid'
          gap='30px'
          gridTemplateColumns='repeat(4, minmax(0, 1fr))'
          sx={{
            '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
          }}
        >
          <InputLabel>Name</InputLabel>
          <TextField
            fullWidth
            variant='filled'
            type='text'
            label={content.name}
            onChange={change}
            value={form.name}
            id='name'
            sx={{ gridColumn: 'span 4' }}
          />

          <InputLabel>Category</InputLabel>
          <TextField
            fullWidth
            variant='filled'
            type='text'
            label={content.category}
            onChange={change}
            value={form.category}
            id='category'
            sx={{ gridColumn: 'span 4' }}
          />

          <InputLabel>Brand</InputLabel>
          <TextField
            fullWidth
            variant='filled'
            type='text'
            label={content.brand}
            onChange={change}
            value={form.brand}
            id='brand'
            sx={{ gridColumn: 'span 4' }}
          />

          <InputLabel>Re Order Level</InputLabel>
          <TextField
            fullWidth
            variant='filled'
            type='number'
            label={content.re_order_level}
            onChange={change}
            value={form.re_order_level}
            id='re_order_level'
            sx={{ gridColumn: 'span 4' }}
          />

          <InputLabel>Description</InputLabel>
          <TextField
            fullWidth
            variant='filled'
            type='text'
            label={content.description}
            onChange={change}
            value={form.description}
            id='description'
            sx={{ gridColumn: 'span 4' }}
          />
        </Box>
        <Box display='flex' justifyContent='end' mt='20px'>
          <Button type='submit' color='secondary' variant='contained'>
            Update Product
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default UserUpdateForm
