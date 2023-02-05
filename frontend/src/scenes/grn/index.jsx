import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Add from "@mui/icons-material/Add";

import AdminHeader from "../../components/AdminHeader";
import { useState } from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";
import DesignServices from "@mui/icons-material/DesignServices";
import { useQuery } from "react-query";
import { listGrn, updateProBatches } from "../../actions/grnActions";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Grn = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const users = useSelector((state) => state.userLogin);
  const { userInfo } = users;

  const {
    isLoading,
    isError,
    error,
    data: batches,
  } = useQuery(["batches", userInfo.token], listGrn);

  let content;
  if (isLoading) {
    return <p>Loading</p>;
  } else if (isError) {
    return <p>{error.message}</p>;
  } else {
    content = batches;
  }

  console.log(selectedRows);

  const createGrn = () => {
    navigate("/admin/creategrn");
  };

  const updateGrn = () => {
    let feedback = prompt("Enter new sales price?", "");

    const myObj = {};
    myObj.salesPrice = feedback;
    myObj.token = userInfo.token;
    myObj.id = selectedRows[0].id;

    updateProBatches(myObj);
    toast.success("success!");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const columns = [
    { field: "id", headerName: "Batch ID", flex: 1 },
    {
      field: "name",
      headerName: "product/Material Name",
      cellClassName: "name-column--cell",
      flex: 1,
    },
    {
      field: "qty",
      headerName: "Quantity",
      flex: 1,
    },

    {
      field: "costPrice",
      headerName: "Cost",
    },
    {
      field: "discount",
      headerName: "Discount %",
    },

    {
      field: "salesPrice",
      headerName: "Sales Price",
    },

    {
      field: "item",
      headerName: "Product / Material ID",
      flex: 1,
    },

    {
      field: "date",
      headerName: "Time Stamp",
      flex: 1,
    },
  ];

  console.log(content);
  let rows = content?.map((content) => ({
    id: content.id,
    name: content.name,
    costPrice: content.costPrice,
    discount: content.discount,
    salesPrice: content.discount ?  Number(content.costPrice) - (Number(content.costPrice)*( content.discount/100)) : content.salesPrice,
    qty: content.qty,
    item: content.productId ? content.productId : content.materialId,
    date: new Date(content.createdAt).toString().slice(0, 25),
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport printOptions={{ disableToolbarButton: false }} />

        <Button className="p-0 pe-2" variant="text" onClick={() => createGrn()}>
          <Add fontSize="small" />
          <span className="px-2">Create A GRN</span>
        </Button>

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => updateGrn()}
          >
            <DesignServices fontSize="small" />
            <span className="px-2">Update Sales price</span>
          </Button>
        )}

        {selectedRows.length === 1 && (
          <Button
            className="p-0 pe-2"
            variant="text"
            onClick={() => updateGrn()}
          >
            <DesignServices fontSize="small" />
            <span className="px-2">Add Discount</span>
          </Button>
        )}
      </GridToolbarContainer>
    );
  };

  return (
    <Box m="20px">
      <AdminHeader title="GRN" subtitle="Managing GRNS" />

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = content.filter((row) =>
              selectedIDs.has(row.id)
            );
            setSelectedRows(selectedRows);
          }}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default Grn;
