import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const classes = await prisma.class.findMany({ select: { id: true, name: true, section: true } });
  return NextResponse.json(classes);
}
