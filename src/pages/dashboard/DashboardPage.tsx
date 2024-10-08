import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './search';
import { CreateProduct } from '../buttons/buttons';
import { Link, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {PencilIcon, PlusIcon} from '@heroicons/react/24/outline';
import { Button, Icon, TextField } from '@mui/material';


 export interface Data {
  id: number;
  title: string;
  description: string;
  keywords: string;
  product_category_id: number;
  status: boolean;
}

function createData(
  id: number,
  title: string,
  description: string,
  keywords: string,
  product_category_id: number,
  status: boolean
): Data {
  return {
    id,
    title,
    description,
    keywords,
    product_category_id,
    status,
  };
}



function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';
type DataValue = string | number | boolean;
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: DataValue },
  b: { [key in Key]: DataValue },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array:  T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Product name',
  },
  {
    id: 'description',
    numeric: true,
    disablePadding: false,
    label: 'Product description',
  },
  {
    id: 'keywords',
    numeric: true,
    disablePadding: false,
    label: 'price',
  },
  {
    id: 'product_category_id',
    numeric: true,
    disablePadding: false,
    label: 'category',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'active',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected:number[];
  token:string;
  navigate:NavigateFunction
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected ,selected,token, navigate} = props;
  
  const handleDelete = async()=>{
    const productId = selected[0];
    const res = await axios.delete(`http://localhost:5174/api/Products/DeleteProduct/${productId}`, {headers:{'Authorization':`Bearer ${token}`}});
    if(res.status == 200){
      console.log('delete successfully');
      navigate('/table');
    }
  }
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        null
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        null
      )}
    </Toolbar>
  );
}
export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('title');
  const [selected, setSelected] = React.useState< number[]>([]);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState<Data[]>([]);
  const [keyword, setKeyword] = useState<String | null>('');
  const [edit, setEdit] = useState({edit:false,id:0});
  const[data, setData] = useState<Data|null>(null);
  const location = useLocation();
  const token = useSelector((state: any) => state.auth.token);
  const navigate = useNavigate();
  
   useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const getKeyword = queryParams.get('keyword');
    setKeyword(getKeyword);
    const fetchProduct = async () => {
      try {
        const response = await axios.get('http://localhost:5174/api/Products/GetProduct',{headers:{'Authorization':`Bearer ${token}`}});
        const data = response.data;
        
        
        const products = data.map((item:Data) => createData(item.id, item.title, item.description, item.keywords,item.product_category_id, item.status));
        
        const product = products.filter((item:Data)=> {
          const query = keyword || '';
          return (
            item.product_category_id === Number(query) ||
            item.keywords.toLowerCase().includes(query.toLowerCase()) ||
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          );
          });
        setRows(product);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchProduct()
    
  }

  , [location.search]);
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.checked) {
      const newSelected = rows.map((n:any) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    event.preventDefault();
    const selectedIndex = selected.indexOf(id);
    let newSelected:  number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };
  
  const handleProductChange =   (e:React.ChangeEvent<HTMLInputElement>,rowIndex:number)=>{
    e.preventDefault()
    console.log("Handler triggered");
    const { name, value } = e.target;
    console.log(name, value);
    const updatedValue = name === 'status' ? value === 'true' : value;
    setRows(prevRows => {
      const newRows = prevRows.map((row, index) =>
        index === rowIndex ? { ...row, [name]: updatedValue } : row
      );
      console.log(newRows);  // Check what the updated rows look like
      return newRows;
    });
   
  };

  const handleSave =  (index:number) => {
    const rowToUpdate = rows[index];
    (async () => {
      try{
        const response = await axios.post(`http://localhost:5174/api/Products/UpdateProduct/${rowToUpdate.id}`, rowToUpdate, {headers: {'Authorization':`Bearer ${token}`}});
        if(response.status === 200) {
          setEdit({edit: false, id: 0});
          console.log("Update successfully");
          navigate('/table');
          window.location.reload();
        }
      }catch(error){
        console.error('Error updating data: ', error);
      }
    })();
  }
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );
  
  return (
    <>
    <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateProduct />
    </div>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} token={token} navigate={navigate}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
            { loading? (
              <TableRow>
                <TableCell colSpan={6} align='center'>Loading</TableCell>
              </TableRow>
            ):(
              visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id as number);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    
                    hover
                    onClick={(event) => handleClick(event, row.id as number)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      
                    >
                      {edit.edit && index == edit.id?<TextField onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleProductChange(e, index)}  name="title" defaultValue={row.title} autoFocus/>:row.title}
                    </TableCell>
                    <TableCell align="right">{edit.edit && index == edit.id?<TextField  name="description" onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleProductChange(e, index)} defaultValue={row.description} autoFocus/>:row.description}</TableCell>
                    <TableCell align="right">{edit.edit && index == edit.id?<TextField   name="keywords" onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleProductChange(e, index)} defaultValue={row.keywords} autoFocus/>:row.keywords}</TableCell>
                    <TableCell align="right">{edit.edit && index == edit.id?<TextField  name="product_category_id" onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleProductChange(e, index)} defaultValue={row.product_category_id} autoFocus/>:row.product_category_id}</TableCell>
                    <TableCell align="right">{edit.edit && index == edit.id?<TextField  name="status" onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleProductChange(e, index)} defaultValue={+row.status} autoFocus/>:+row.status}</TableCell>
                    <TableCell>{edit.edit && index == edit.id? <Button  className='w-4' onClick={()=>handleSave(row.id)}>Save</Button>: <Button  className='w-4' onClick={()=>setEdit({edit:!edit.edit, id:index})}>Edit</Button>}</TableCell>
                    
                  </TableRow>
                );
              })
            )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </Box>
    </>
  );
}