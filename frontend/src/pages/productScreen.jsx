import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import Header from '../components/Header'
import AdminHeader from '../components/AdminHeader'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getProductDetails } from '../actions/productActions'
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { updateProduct, createProduct } from '../actions/productActions'
import { toast } from 'react-toastify'

import { tokens } from '../theme'
import { GridExpandMoreIcon } from '@mui/x-data-grid'

const ProductScreen = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const queryClient = useQueryClient()
  const location = useLocation()
  const dispatch = useDispatch()
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

  let { name } = form

  const users = useSelector((state) => state.userLogin)
  const { userInfo } = users

  const {
    isLoading,
    isError,
    error,
    data: product,
  } = useQuery(['product', userInfo.token, id], getProductDetails)
  console.log(product)

  //   const queryParams = new URLSearchParams(location.search);

  //   // Now you can use the queryParams object to access individual query parameters
  //   const param1 = queryParams.get('param1');

  let content
  if (isLoading) {
    return <p>Loading</p>
  } else if (isError) {
    return <p>{error.message}</p>
  } else {
    content = product
  }

  

  return (
    <Box m='20px'>
      <AdminHeader
        title='Product Screen'
        subtitle='Detailed view of the product'
      />


        <Box
          display='grid'
          gap='30px'
          gridTemplateColumns='repeat(4, minmax(0, 1fr))'
          sx={{
            '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
          }}
        >
      
          
          <Accordion defaultExpanded sx={{ gridColumn: 'span 4' }}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <Typography variant="h4"> Name</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ background: '#f0f0f0' }}>
              <Typography  variant="h4">{content.name}</Typography>
            </AccordionDetails>
          </Accordion>

     
          <Accordion defaultExpanded sx={{ gridColumn: 'span 4' }}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <Typography variant="h4"> Price</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ background: '#f0f0f0' }}>
              <Typography variant="h4">{content.price.toLocaleString()}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded sx={{ gridColumn: 'span 4' }}>
            <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
              <Typography variant="h4"> Available Quantity</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ background: '#f0f0f0' }}>
              <Typography variant="h4">{content.qty}</Typography>
            </AccordionDetails>
          </Accordion>

          {/* <TextField
            fullWidth
            variant='filled'
            label={content.description}
            value={form.description}
            id='description'
            readonly
            sx={{ gridColumn: 'span 4' }}
          /> */}
        </Box>

    </Box>
  )
}

export default ProductScreen
