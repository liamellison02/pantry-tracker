'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from '@/firebase'
import { Box, Typography } from '@mui/material'
import { collection, query, getDocs, doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { it } from "node:test";

export default function Home() {
  const [inventory, setInventory]: any = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
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
    const docRef = doc(collection(firestore, 'inventory', item));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, {quantity: quantity - 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory();
  }

  const removeItem = async (item: any) => {
    const docRef = doc(collection(firestore, 'inventory', item));
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
    <Box>
      <Typography variant="h1">Hello World</Typography>
      {
        inventory.forEach((item: any) => {
          return(
            <Box>
              <Typography variant="h2">{item.name}</Typography>
              <Typography variant="h4">{item.count}</Typography>
            </Box>
          )
        })
      }
    </Box>

  )
}
