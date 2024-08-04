"use client";
import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  query,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/firebase";

export default function Home() {
  const [database, setDatabase] = useState([]);
  const [Filtered_database, set_Filtered_Database] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (search_value) => {
    setSearchQuery(search_value.target.value);
    filter_database(searchQuery);
  };

  const filter_database = () => {
    if (searchQuery === "") {
      return database;
    } else {
      return database.filter((item) =>
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  };

  const update_database = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, "database")));
      const database_list = snapshot.docs.map((doc) => ({
        id: doc.id,
        quantity: doc.data().quantity || 0, // Default to 0 if quantity is not set
      }));
      setDatabase(database_list);
      set_Filtered_Database(filter_database(""));
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    update_database();
  }, []);

  // Filter data whenever `searchQuery` or `database` changes
  useEffect(() => {
    set_Filtered_Database(filter_database());
  }, [searchQuery, database]);

  const removeItem = async (itemId) => {
    const docRef = doc(db, "database", itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();

      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      await update_database();
    }
  };

  const addItem = async (itemId) => {
    try {
      const docRef = doc(db, "database", itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await update_database();
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vw"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      bgcolor={"#C4A484"}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Content of the Modal */}
          <Typography variant="h6">Enter Item Name</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* this is a wrapper to give the whole box a border */}
      {/* header box */}
      <Box
        width="100%"
        height="auto"
        bgcolor={"#C4A484"}
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Typography
          variant={"h1"}
          color={"#333"}
          textAlign={"center"}
          fontFamily={"Roboto"}
        >
          Pantry List
        </Typography>
      </Box>

      {/* stack that is a search field */}
      <Box padding={5}>
        <TextField
          fullWidth
          label="Search"
          id="fullWidth"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Box>

      {/* stack that holds the items */}
      <Stack width="75vw" height="100vh" spacing={1} overflow="auto">
        {/* Header information for quantity and add/remove */}
        <Stack direction="row" spacing={2} bgcolor="#C4A484" padding={2}>
          <Box
            width="100%"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Button
              variant="contained"
              onClick={() => {
                handleOpen();
              }}
            >
              Add New Item
            </Button>
          </Box>

          <Box
            width={100} // Fixed width to align with the quantity box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" color="#333" fontFamily="Roboto">
              Quantity
            </Typography>
          </Box>

          <Box
            width="auto" // Adjust to fit content
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" color="#333" fontFamily="Roboto">
              Add/Remove
            </Typography>
          </Box>
        </Stack>

        {/* Display the actual items from the database here */}
        {Filtered_database.map((item) => (
          <Box
            key={item.id}
            width="100%"
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            bgcolor="#C4A484"
            padding={2} // Add padding around the content
          >
            <Typography
              variant="h5" // Use h5 for better fitting
              color="#333"
              fontFamily="Roboto"
              flexBasis={0} // Allow to shrink and grow
              flexGrow={1} // Allows the text to take up available space
              paddingLeft={2} // Adjust padding as needed
            >
              {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
            </Typography>

            <Box
              width={100} // Fixed width for the quantity container
              textAlign="center"
            >
              <Typography variant="h5" color="#333" fontFamily="Roboto">
                {item.quantity}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                onClick={() => addItem(item.id)}
              >
                Add
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={() => removeItem(item.id)}
              >
                Del
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
