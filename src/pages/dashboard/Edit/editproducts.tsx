import React from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";



export default function EditProduct(){
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);
  const {id} = useParams<"id">();
  const [data, setData] = useState({
    
    title: "",
    description: "",
    product_category_id: 0,
    keywords: "",
    status: false
  });
  useEffect(()=>{
    const fetchProduct = async ()=>{
        const products = await axios.get(`http://localhost:5174/api/Products/GetProductById/${id}`,{headers:{'Authorization':`Bearer ${token}`}});
        setData(products.data);
    }
    if (id) {
      fetchProduct();
    }
    
  },[id]);
  console.log(data);
  const handleChange = (e:any)=>{
    const {name, value} = e.target;
    setData(prev => ({
      ...prev,
      [name]:value
    }))
  };
  const handleSubmit =async (e:{preventDefault: ()=> void;currentTarget: HTMLFormElement | undefined}) => {
    e.preventDefault();
    
    const query = {title:data.title,description:data.description, product_category_id:data.product_category_id,keywords:data.keywords,status:data.status }
    
    
    await axios.post(`http://localhost:5174/api/Products/UpdateProduct/${id}`,query,{headers:{'Authorization':`Bearer ${token}`}});
    navigate('/table')
    
  }
  return (
    <Container component="main" maxWidth="md" >
      <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Box component="form"  onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="title"
                  label="title"
                  name="title"
                  autoComplete="title"
                  value={data.title}
                  onChange={handleChange}
                  autoFocus
                />

               <TextField
                  margin="normal"
                  fullWidth
                  id="product_category_id"
                  label="product_category_id"
          
                  name="product_category_id"
                  autoComplete="product_category_id"
                  value={data.product_category_id}
                  onChange={handleChange}
                  autoFocus
                />
                
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="description"
                  name="description"
                  autoComplete="description"
                  value={data.description}
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="keywords"
                  label="keywords"
                  name="keywords"
                  autoComplete="keywords"
                  value={data.keywords}
                  onChange={handleChange}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="status"
                  label="status"
            
                  name="status"
                  autoComplete="status"
                  value={data.status}
                  onChange={handleChange}
                  autoFocus
                />
                <Button
              type="submit"
              
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >Submit</Button>
            </Box>
      </Box>
    </Container>
  );
}