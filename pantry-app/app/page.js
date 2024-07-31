"use client"
import {Box, Typography, Button, Modal, TextField} from '@mui/material'
import Stack from '@mui/material/Stack';
import { collection, getDocs, query, setDoc } from 'firebase/firestore';
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
    const snapshot = query(collection(db, 'pantry'))
    const docs = await getDocs(snapshot)
    const database_list = []
    docs.forEach((doc)=> {
      database_list.push(doc.id)
    })
    setDatabase(database_list)
  }

  useEffect(() => {
    update_database()
  }, [])

  const removeItem = async(item) => {
    const docRef = doc(collection(db, 'database'), item)
    const docSnap = await getDocs(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()

      if (quantity === 1) {
        await deleteDoc(docRef)
      } else { 
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
  }

  const addItem = async(item) => {
    const docRef = doc(collection(db, 'database'), item)
    const docSnap = await getDocs(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})      
    } else {
      await setDoc(docref, {quantity: 1})
    }

    await update_database()
  }

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
      <Typography variant="h6">Add Item</Typography>
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
  >Add</Button>

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
    
      database.map((i) => (
        // configuration for the individual box sizes
        <Box
          key={i}
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
            {
              i.charAt(0).toUpperCase() + i.slice(1)
            }
          </Typography>
        </Box>

    ))}
  </Stack>

  </Box>
  </Box>
}