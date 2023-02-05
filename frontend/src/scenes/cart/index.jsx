import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { tokens } from "../../theme";

import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "react-query";

import { useSelector } from "react-redux";

import { createSales } from "../../actions/salesActions";
import { toast } from "react-toastify";
import { getCartList } from "../../actions/cartAction";
import { listAllCustomers } from "../../actions/customerActions";

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const Cart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState("");
  const [build, setBuild] = useState(0);

  const navigate = useNavigate();
  

  const users = useSelector((state) => state.userLogin);
  const { userInfo } = users;

  const { data: customers } = useQuery(
    ["customers", userInfo.token],
    listAllCustomers
  );

  const {
    isLoading,
    isError,
    error,
    data: cart,
  } = useQuery(["cart"], getCartList);

  const createMutation = useMutation(createSales, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("cart");
      toast.success("Success!");
     
      window.open(`${window.location.origin}/invoice/${data.id}`)
     
      navigate("/admin/sales");
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.log(error);
    },
  });

  let content;
  if (isLoading) {
  } else if (isError) {
  } else {
    content = cart;
  }


  const resetCart = () => {
    localStorage.removeItem("cart");
    window.location.reload();
  };

  const createSale = () => {
    createMutation.mutate({
      SalesItems: content,
      cartTotal: content
        ?.reduce((acc, cv) => acc + cv.salesPrice * cv.qty, 0)
        .toFixed(2),
      discount: build,
      customer: keyword,
      token: userInfo.token,
    });
  };



  const customerEmail = [];

  customers?.forEach((item) => customerEmail.push(`${item.name} ${item.id}`));



  return (
    <Box>
      <Box m="20px 200px">
        <Autocomplete
          fullWidth
          variant="filled"
          disablePortal
          id="combo-box-demo"
          options={customerEmail}
          onChange={(event, value) => setKeyword(value)}
          sx={{ background: `${colors.primary[400]}` }}
          renderInput={(params) => (
            <TextField {...params} label="Customer Name" />
          )}
        />
        <TableContainer >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "15px" }}>Item Name</TableCell>

                <TableCell sx={{ fontSize: "15px" }} align="right">
                  Price x Qty
                </TableCell>
                <TableCell align="right" sx={{ fontSize: "15px" }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>

                  <TableCell align="right">
                    {" "}
                    {item.salesPrice.toLocaleString()} x {item.qty}
                  </TableCell>
                  <TableCell align="right">
                    {(item.salesPrice * item.qty).toFixed(2)} LKR
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* salesPrice: content.discount
    ? Number(content.salesPrice) -
      Number(content.salesPrice) * (content.discount / 100)
    : content.salesPrice, */}

        <hr />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          p="15px 0"
        >
          <Box>
            <Typography  >
              CART TOTAL
            </Typography>
            <Typography color={colors.grey[100]}>
              {/* {transaction.user ? transaction.user : 'Admin'} */}
            </Typography>
          </Box>
          <Box color={colors.grey[100]} textAlign="right"></Box>
          <Box p="5px 10px" borderRadius="4px">
            ={" "}
            {content
              ?.reduce((acc, cv) => acc + cv.salesPrice * cv.qty, 0)
              .toFixed(2)}{" "}
            LKR
          </Box>
        </Box>
        <hr />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          p="15px 0"
        >
          <Box>
            <Typography >
              Discount %
            </Typography>
            <Typography color={colors.grey[100]}>
              {/* {transaction.user ? transaction.user : 'Admin'} */}
            </Typography>
          </Box>
          <Box color={colors.grey[100]} textAlign="right"></Box>
          <Box p="5px 10px" borderRadius="4px">
            <input
              type="number"
              style={{
                width: "100px",
                background: `${colors.primary[400]}`,
              }}
              value={build}
              onChange={(e) => setBuild(e.target.value)}
              min="0"
              max="100"
              required
            />
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={`4px solid ${colors.primary[500]}`}
          p="15px 0"
          borderTop=" thick double"
        >
          <Box>
            <Typography variant="h5" fontWeight="600">
              SUB TOTAL
            </Typography>
            <Typography color={colors.grey[100]}>
              {/* {transaction.user ? transaction.user : 'Admin'} */}
            </Typography>
          </Box>
          <Box color={colors.grey[100]} textAlign="right"></Box>
          <Box p="5px 10px" borderRadius="4px">
            ={" "}
            {(content?.reduce((acc, cv) => acc + cv.salesPrice * cv.qty, 0) -
              (Number(build) / 100) *
                content?.reduce((acc, cv) => acc + cv.salesPrice * cv.qty, 0)).toFixed(2)}
            LKR
          </Box>
        </Box>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button variant="contained" color="secondary" onClick={createSale}>
            Submit
          </Button>
          <Button variant="contained" color="error" onClick={resetCart}>
            Reset
          </Button>
        </div>
      </Box>
    </Box>
  );
};

export default Cart;
