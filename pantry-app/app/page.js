"use client"
import {Box, Typography, Button, Modal, TextField} from '@mui/material'
import Stack from '@mui/material/Stack';
import { collection, getDocs, getDoc, setDoc, doc, query, deleteDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';

export default function Home() {

  // const [pantry, setPantry] = useState([])
  // useEffect(() => {
  // const updatePantry = async () => {
  //   const snapshot = query(collection(db, 'pantry'))
  //   const docs = await getDocs(snapshot)
  //   const pantryList = []
  //   docs.forEach((doc) => {
  //     pantryList.push(doc.id)
  //   })
  //   console.log(pantryList)
  //   setPantry(pantryList)
  // }
  // updatePantry()
  // }, [])

  const [database, setDatabase] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const update_database = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, 'database')));
      const database_list = snapshot.docs.map(doc => ({
        id: doc.id,
        quantity: doc.data().quantity || 0 // Default to 0 if quantity is not set
      }));
      setDatabase(database_list);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    update_database()
  }, [])

  const removeItem = async(itemId) => {
    const docRef = doc(db, 'database', itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      } else { 
        await setDoc(docRef, {quantity: quantity - 1})
      }
      await update_database();
    }
  }

  const addItem = async (itemId) => {
    try {
        const docRef = doc(db, 'database', itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const { quantity } = docSnap.data();
            await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
        } else {
            await setDoc(docRef, { quantity: 1 });
        }
        await update_database();
    } catch (error) {
        console.error('Error adding item: ', error);
    }
};

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return <Box
  width="100vw" 
  height="100vw"
  display = {'flex'}
  justifyContent={'center'}
  flexDirection={'column'}
  alignItems={'center'}
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
      {/* Content of the Modal */}
      <Typography variant="h6">Enter Item Name</Typography>
      <Stack width="100%" direction="row" spacing={2}>
        <TextField
          variant="outlined"
          fullWidth
          value={itemName}
          onChange={(e)=> {
            setItemName(e.target.value)
          }}
        />
        <Button
        variant='outlined'
        onClick={() => {
          addItem(itemName)
          setItemName('')
          handleClose()
        }}
        >
          Add
        </Button>
      </Stack>
    </Box>
  </Modal>

  <Button
    variant='contained'
    
    onClick={() => {
      handleOpen()
    }}
  >Add New Item</Button>

    {/* this is a wrapper to give the whole box a border */}
    <Box border={'1px solid #333'}> 

    {/* header box */}
    <Box 
    width="800px" 
    height="100px"
    bgcolor={'#ADD8E6'}
    display = {'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
     >
      <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
        Pantry Items
      </Typography>
    </Box>


    {/* stack that holds the items */}
  <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
    {
    
      database.map((item) => (
        // configuration for the individual box sizes
        <Box
          key={item.id}
          width="100%"
          height="400%"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'#f0f0f0'}
          
        >
          
          <Typography
            variant={'h3'}
            color={'#333'}
            textAlign={'center'}>

            {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
          </Typography>
          
          <Typography
            variant={'h3'}
            color={'#333'}
            textAlign={'center'}>
            {item.quantity}
          </Typography>

          <Stack direction="row" spacing={1}>
            
          <Button 
            variant="outlined"
            size='small'
            onClick={() => {
              addItem(item.id)
            }}
           >add</Button>

          <Button 
            variant="outlined"
            size='small'
            onClick={() => {
              removeItem(item.id)
            }}
           >del</Button>
          </Stack>

          </Box>

    ))}
  </Stack>

  </Box>
  </Box>
}