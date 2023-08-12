"use client";

import React, { useState, useEffect } from "react";
import Editable from "./Editable";
import columns from "./columns";
import axios from "axios";
import { Center, MantineProvider } from "@mantine/core";
import { toast } from "react-hot-toast";

interface RowData {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
}

const YourPage = () => {
  const [data, setData] = useState<RowData[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<RowData[]>("/api/table");
      setData(response.data);
    } catch (error) {
      toast.error("Error fetching data...");
    }
  };

  const handleAddRow = async (newRowData: RowData) => {
    try {
      const response = await axios.post<RowData>("/api/table", newRowData);
      setData([...data, response.data]);
      toast.success("Row added successfully!");
    } catch (error) {
      toast.error("Error adding row!");
    }
  };

  const handleUpdateRow = async (id: string, newData: RowData) => {
    try {
      const response = await axios.put<RowData>("/api/table", { id, newData });
      const updatedData = data.map((row) =>
        row.id === id ? response.data : row
      );
      setData(updatedData);
      toast.success("Row updated successfully!");
    } catch (error) {
      toast.error("Error updating row!");
    }
  };

  const handleDeleteRow = async (id: string) => {
    try {
      await axios.delete(`/api/table?id=${id}`, { data: { id } });
      const updatedData = data.filter((row) => row.id !== id);
      setData(updatedData);
      toast.success("Row deleted successfully!");
    } catch (error) {
      toast.error("Error deleting row!");
    }
  };

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <Center>
        <h1>Your Editable Table</h1>
      </Center>
      <Editable
        data={data}
        columns={columns}
        onAddRow={handleAddRow}
        onUpdateRow={handleUpdateRow}
        onDeleteRow={handleDeleteRow}
      />
    </MantineProvider>
  );
};

export default YourPage;
