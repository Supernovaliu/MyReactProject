import { Box, Button, Container, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Form, useNavigate } from "react-router-dom";
export default function AddProduct(){
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);

  const handleSubmit = (e:{preventDefault: ()=> void;currentTarget: HTMLFormElement | undefined}) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get("title"));
    
    const description = String(data.get("description"));
    const product_category_id = Number(data.get("product_category_id"));
    const keywords = String(data.get("keywords"));
    const status = Boolean(data.get("status"));
    const query = {title:title,description:description, product_category_id:product_category_id,keywords:keywords,status:status }
    console.log(query);
    const update = async () => {
        const res = await axios.post("http://localhost:5174/api/Products/AddProduct",query,{headers:{'Authorization':`Bearer ${token}`}})
        navigate('/table')
    }
    update();
  }
  return(
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
                  autoFocus
                />

               <TextField
                  margin="normal"
                  fullWidth
                  id="product_category_id"
                  label="product_category_id"
                  type="number"
                  name="product_category_id"
                  autoComplete="product_category_id"
                  autoFocus
                />
               
                <TextField
                  margin="normal"
                  fullWidth
                  id="description"
                  label="description"
                  name="description"
                  autoComplete="description"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="keywords"
                  label="keywords"
                  name="keywords"
                  autoComplete="keywords"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="status"
                  label="status"
            
                  name="status"
                  autoComplete="status"
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