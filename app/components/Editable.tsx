"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  Container,
  Button,
  Input,
  Select,
  Radio,
  Group,
  createStyles,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { format } from "date-fns";

interface BasicTableProps {
  data: any[];
  columns: any[];
  onAddRow: (newData: any) => void;
  onUpdateRow: (id: string, newData: any) => void;
  onDeleteRow: (id: string) => void;
}

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

const BasicTable: React.FC<BasicTableProps> = ({
  data,
  columns,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
      rowSelection: rowSelection,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  const [editableRowId, setEditableRowId] = useState<string | null>(null);
  const [newRow, setNewRow] = useState<any | null>(null);

  const educationOptions = [
    "Matriculation",
    "Intermediate",
    "Bachelors",
    "Masters",
    "PhD",
  ];

  const handleAddRow = () => {
    const newRowData = {
      id: `new-${Date.now()}`,
      name: "",
      age: 0,
      gender: "",
      city: "",
      birthDate: new Date().toISOString().split("T")[0],
      education: educationOptions[0],
    };

    setNewRow(newRowData);
  };

  const handleEditRow = (rowId: string) => {
    setEditableRowId(rowId);
  };

  const handleSaveRow = (rowId: string) => {
    const rowToUpdate = table
      .getRowModel()
      .rows.find((row) => row.original.id === rowId);
    if (rowToUpdate) {
      onUpdateRow(rowId, rowToUpdate.original);
      setEditableRowId(null);
    }
  };

  const handleDeleteRow = (rowId: string) => {
    onDeleteRow(rowId);
  };

  const handleDoubleClick = (rowId: string) => {
    handleEditRow(rowId);
  };

  const { classes } = useStyles();

  return (
    <Container style={{ maxWidth: "80%", margin: "0 auto" }}>
      <Input
        type="text"
        placeholder="Enter a keyword to filter..."
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
      />
      <Table style={{ marginTop: "1.5rem" }} striped>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={classes.control}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {
                        { asc: " ▲", desc: " ▼" }[
                          (header.column.getIsSorted() as string) ?? null
                        ]
                      }
                    </div>
                  )}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isEditing = editableRowId === row.original.id;
            return (
              <tr
                key={row.id}
                onDoubleClick={() => handleDoubleClick(row.original.id)}
                style={{}}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {cell.column.id !== "select" && isEditing ? (
                        cell.column.id === "birthDate" ? (
                          <DatePickerInput
                            onChange={(date) =>
                              (cell.row.original[cell.column.id] = date
                                ?.toISOString()
                                .split("T")[0])
                            }
                          />
                        ) : cell.column.id === "education" ? (
                          <Select
                            data={educationOptions}
                            onChange={(value) =>
                              (cell.row.original[cell.column.id] = value)
                            }
                          />
                        ) : cell.column.id === "gender" ? (
                          <Radio.Group
                            onChange={(value) =>
                              (cell.row.original[cell.column.id] = value)
                            }
                          >
                            <Group mt="xs">
                              <Radio label="Male" value="Male" />
                              <Radio label="Female" value="Female" />
                            </Group>
                          </Radio.Group>
                        ) : cell.column.id === "age" ? (
                          <Input
                            type="number"
                            defaultValue={cell.row.original[cell.column.id]}
                            onChange={(e) =>
                              (cell.row.original[cell.column.id] =
                                e.currentTarget.value)
                            }
                          />
                        ) : (
                          <Input
                            defaultValue={cell.row.original[cell.column.id]}
                            onChange={(e) =>
                              (cell.row.original[cell.column.id] =
                                e.currentTarget.value)
                            }
                          />
                        )
                      ) : cell.column.id === "birthDate" ? (
                        format(
                          new Date(cell.row.original[cell.column.id]),
                          "MMMM d, yyyy"
                        )
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </td>
                  );
                })}
                <td key={row.id}>
                  {isEditing ? (
                    <>
                      <Button
                        color="green"
                        onClick={() => handleSaveRow(row.original.id)}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="red"
                        onClick={() => handleDeleteRow(row.original.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {newRow && (
            <tr key={newRow.id}>
              {columns.map((column) => {
                column.id !== "select";
                return (
                  <td key={`${newRow.id}-${column.accessorKey}`}>
                    {column.id !== "select" ? (
                      column.accessorKey === "birthDate" ? (
                        <DatePickerInput
                          onChange={(date) =>
                            (newRow[column.accessorKey] = date
                              ?.toISOString()
                              .split("T")[0])
                          }
                        />
                      ) : column.accessorKey === "education" ? (
                        <Select
                          data={educationOptions}
                          onChange={(value) =>
                            (newRow[column.accessorKey] = value)
                          }
                        />
                      ) : column.accessorKey === "gender" ? (
                        <Radio.Group
                          onChange={(value) =>
                            (newRow[column.accessorKey] = value)
                          }
                        >
                          <Group mt="xs">
                            <Radio label="Male" value="Male" />
                            <Radio label="Female" value="Female" />
                          </Group>
                        </Radio.Group>
                      ) : column.accessorKey === "age" ? (
                        <Input
                          type="number"
                          defaultValue={newRow[column.accessorKey]}
                          onChange={(e) =>
                            (newRow[column.accessorKey] = e.currentTarget.value)
                          }
                        />
                      ) : (
                        <>
                          <Input
                            defaultValue={newRow[column.accessorKey]}
                            onChange={(e) =>
                              (newRow[column.accessorKey] =
                                e.currentTarget.value)
                            }
                          />
                        </>
                      )
                    ) : (
                      <></>
                    )}
                  </td>
                );
              })}
              <td key={newRow.id}>
                <Button
                  color="green"
                  onClick={() => {
                    onAddRow(newRow);
                    setNewRow(null);
                  }}
                >
                  Add
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Button
        variant="outline"
        color="gray"
        style={{ marginTop: "1rem" }}
        onClick={handleAddRow}
      >
        Add New Row
      </Button>
    </Container>
  );
};

export default BasicTable;
