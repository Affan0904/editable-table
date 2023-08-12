import { NextResponse } from "next/server";
import mockdata from "@/mockdata.json";

interface RowData {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  birthDate: string;
  education: string;
}

const validateData = (data: RowData) => {
  if (
    !data.name ||
    !data.age ||
    !data.gender ||
    !data.city ||
    !data.birthDate ||
    !data.education
  ) {
    throw new Error("Incomplete data");
  }
};

export async function GET(request: Request) {
  const data: RowData[] = mockdata;
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const response = await request.json();
    const { name, age, gender, city, birthDate } = response;
    const newRowData: RowData = response;

    if (!name || !age || !gender || !city || !birthDate) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    newRowData.id = Math.random().toString(36).substr(2, 9);
    mockdata.push(newRowData);
    return NextResponse.json(newRowData, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

export async function PUT(request: Request) {
  try {
    const response = await request.json();
    const { id, newData }: { id: string; newData: RowData } = response;
    validateData(newData);

    const index = mockdata.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockdata[index] = { ...mockdata[index], ...newData };
      return NextResponse.json(newData);
    } else {
      throw new Error("Row not found");
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request: Request) {
  try {
    const response = await request.json();
    const { id } = response;
    const index = mockdata.findIndex((item) => item.id === id);
    if (index !== -1) {
      mockdata.splice(index, 1);
      return NextResponse.json(mockdata, { status: 204 });
    } else {
      throw new Error("Row not found");
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
