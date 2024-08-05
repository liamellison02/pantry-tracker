'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { Box, Button, Container, Modal, Stack, TextField, Typography } from '@mui/material'
import { collection, query, getDocs, doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { it } from "node:test";

export default function Home() {
  const [inventory, setInventory]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  
  const updateInventory = async () => {
    const snapshot = query(collection(db, 'inventory'));
    const docs = await getDocs(snapshot);
    
    const inventoryList: any = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      })
    });
    setInventory(inventoryList);
    console.log(inventoryList);
  }

  const addItem = async (item: any) => {
    const docRef = doc(collection(db, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory();
  }

  const removeItem = async (item: any) => {
    const docRef = doc(collection(db, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, {
          quantity: quantity - 1
        })
      }
    }

    await updateInventory();
  }

  useEffect(() => {
    updateInventory();
  }, []);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h2">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
            variant="contained" 
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={()=>handleOpen()}>
        Add Item
      </Button>
      <Box border="1px solid #333">
        <Box 
        display="flex" 
        width="800px" 
        height="100px"
        bgcolor="#ADD8E6"
        justifyContent="center"
        alignContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory
          </Typography>
        </Box>
      
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({name, quantity}: {name: string, quantity: number}) => (
          <Box 
          key={name} 
          width="100%"
          minHeight="150px"
          display="flex" 
          alignItems="center"
          justifyContent="space-between" 
          bgcolor="#f0f0f0"
          padding={5}
          > 
            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
              <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
            </Stack>
          </Box>
        ))}
      </Stack>
      </Box>  
    </Box>
  )
}
