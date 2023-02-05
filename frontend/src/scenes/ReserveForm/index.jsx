import { Autocomplete, Box, Button, TextField, useTheme } from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'

import AdminHeader from '../../components/AdminHeader'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { useNavigate } from 'react-router-dom'

import { useMutation, useQuery } from 'react-query'
import { createGrn, listproductMAatNames } from '../../actions/grnActions'
import { tokens } from '../../theme'
import { useState } from 'react'

const ReserveForm = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const isNonMobile = useMediaQuery('(min-width:600px)')
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const users = useSelector((state) => state.userLogin)
  const { userInfo } = users

  const addProductMutation = useMutation(createGrn, {
    onSuccess: () => {
      toast.success('GRN created!')
      navigate('/admin/grn')
    },

    onError: (error) => {
      toast.error(error.response.data)
      console.log(error)
    },
  })

  const {
    isLoading,
    isError,
    error,
    data: names,
  } = useQuery(['names', userInfo.token], listproductMAatNames)

  let content
  if (isLoading) {
    return <p>Loading</p>
  } else if (isError) {
    return <p>{error.message}</p>
  } else {
    content = names
  }

  const handleFormSubmit = (values) => {
    console.log(values)
    // addProductMutation.mutate({ ...values,name:keyword, token: userInfo.token })
  }


  const namesArr= []
  content?.forEach(item => namesArr.push(item.name))
  console.log(namesArr)

  return (
    <Box m='20px'>
      <AdminHeader title='RESERVE' subtitle='Reserve Product' />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display='grid'
              gap='30px'
              gridTemplateColumns='repeat(4, minmax(0, 1fr))'
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
              }}
            >
              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='Quantity'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.qty}
                name='qty'
                error={!!touched.qty && !!errors.qty}
                helperText={touched.qty && errors.qty}
                sx={{ gridColumn: 'span 4' }}
              />

              <TextField
                fullWidth
                variant='filled'
                type='text'
                label='Amount'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.amount}
                name='amount'
                error={!!touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
                sx={{ gridColumn: 'span 4' }}
              />

            </Box>
            <Box display='flex' justifyContent='end' mt='20px'>
              <Button type='submit' color='secondary' variant='contained'>
               Reserve
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  )
}

const checkoutSchema = yup.object().shape({
 
  amount: yup.number().required('required'),
  qty: yup.number().required('required'),
})
const initialValues = {
  qty: '',
  amount: '',  
}

export default ReserveForm
