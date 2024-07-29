"use client"
import {Box, Typography} from '@mui/material'
import Stack from '@mui/material/Stack';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/firebase';

export default function Home() {
  const [pantry, setPantry] = useState([])
  useEffect(() => {
  const updatePantry = async () => {
    const snapshot = query(collection(db, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push(doc.id)
    })
    console.log(pantryList)
    setPantry(pantryList)
  }
  updatePantry()
  }, [])

  return <Box
  width="100vw" 
  height="100vw"
  display = {'flex'}
  justifyContent={'center'}
  flexDirection={'column'}
  alignItems={'center'}
  >
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
    
      pantry.map((i) => (
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