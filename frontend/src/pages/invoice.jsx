import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getInvoiceData } from "../actions/salesActions";

const Invoice = () => {
  const { id } = useParams();

  // const users = useSelector((state) => state.userLogin)
  // const { userInfo } = users

  const {
    isLoading,
    isError,
    error,
    data: invoiceData,
  } = useQuery(["invoice", id], getInvoiceData);

  let content;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    content = invoiceData;
  }

  console.log(content);
  const element = document.createElement("div");
  element.id = "test";
  document.body.appendChild(element);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between">
        <Box margin="0% 0">
          <p style={{ fontSize: "60px", margin: "0", color: "#73261c" }}>
            INVOICE
          </p>

          <p>
            <span style={{ fontSize: "20px" }}>{content.customer.name}</span>
            <br />
            <span style={{ fontSize: "20px" }}>{content.customer.address}</span>
            <br />
            <span style={{ fontSize: "20px" }}>{content.customer.phone}</span>
          </p>
        </Box>
        <Box margin="2% 0">
          <img width="300px" src="../assets/logo.jpg" alt="" />
        </Box>
      </Box>
      <Box margin="2% 0 4%">
        <span style={{ fontSize: "20px" }}>Date : </span>
        <span style={{ fontSize: "20px" }}>
          {content.sale.createdAt.slice(0, 10)}
          <br />
        </span>
        <p style={{ fontSize: "20px" }}>Invoice Number:</p>
        <span style={{ fontSize: "20px" }}>
          {content.sale.id}
          <br />
        </span>
      </Box>

      <Table id="myId">
        <TableHead>
          <TableRow style={{ background: "#ddd0c7" }}>
            <TableCell>DESCRIPTION</TableCell>
            <TableCell>NO</TableCell>
            <TableCell>PRICE</TableCell>
            <TableCell>TOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content.salesItems.map((item) => (
            <TableRow key={item.id} style={{ background: "#eae6e3" }}>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price} LKR</TableCell>
              <TableCell>{item.quantity * item.price} LKR</TableCell>
            </TableRow>
          ))}
          {/* <TableRow style={{background:'#eae6e3'}}>
            <TableCell>Discount</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{content.sale.discount}%</TableCell>
          </TableRow> */}

          {/* <TableRow style={{background:'#eae6e3'}}>
            <TableCell>Sub Total</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>{content.sale.subTotal}LKR</TableCell>
          </TableRow> */}
        </TableBody>
      </Table>

      <Box display="flex" style={{ background: "#eae6e3" }}>
        <Box margin="2%" padding="1.5%" flex="1">
          <p>Warranty Period: 5 Years</p>
          <p style={{ fontSize: "10px" }}>
            Warranty will be provided only for the wooden structure of the
            furniture and does not provide coverage to the Fabrics, Cushions,
            Glasses and the damages caused to the furniture due to customer
            negligence.
          </p>
        </Box>
        <Box
          margin="2%"
          padding="1.5%"
          flex="1"
          display="flex"
          style={{ background: "#ddd0c7" }}
        >
          <Box>
            <p style={{ fontSize: "20px" }}>SUBTOTAL</p>
            <p style={{ fontSize: "20px" }}>DISCOUNT</p>
            <b style={{ fontSize: "20px" }}>TOTAL</b>
          </Box>
          <Box>
            <p style={{ fontSize: "20px" }}> : {content.sale.total} LKR</p>
            <p style={{ fontSize: "20px" }}> : {content.sale.discount} %</p>
            <b style={{ fontSize: "20px" }}> :{content.sale.subTotal} LKR</b>
          </Box>
        </Box>
      </Box>

      <Box display="flex" style={{ background: "#eae6e3" , paddingBottom:'2%'}}>
        <Box margin="2%"  flex="1"></Box>
        <Box flex="1" display="flex">
          <p>Thank you very much for your business.</p>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between"  style={{ background: "#ddd0c7" }}>
        <Box margin="2%">
         <b style={{ fontSize: "16px", margin: "0", color: "#73261c" }}>SANDELLA FURNITURE</b>
         <br/>
         <b style={{ fontSize: "16px", margin: "0", color: "#73261c" }}>NO: 201/1 NAWALA RD, NUGEGODA</b>
        </Box>
        <Box margin="2%">
          <p>HOTLINE: 0112 809015</p>
          <p>sandella.furniture@gmail.com</p>
          <p>www.sandellafurniture.com</p>
        </Box>
      </Box>

      <p>{new Date().toString()}</p>
      <Box textAlign="center">
        {" "}
        &copy; Open Code Labs - {new Date().toString().slice(10, 15)}
      </Box>
    </Container>
  );
};

export default Invoice;
