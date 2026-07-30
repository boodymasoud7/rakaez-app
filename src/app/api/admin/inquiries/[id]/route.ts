import { NextResponse } from 'next/server';
import { updateJson } from '@/lib/content/writer';
import type { Inquiry } from '@/lib/content/types';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['new', 'contacted', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedList = await updateJson<Inquiry[]>(
      'inquiries.json',
      (current) =>
        (current || []).map((item) =>
          item.id === id ? { ...item, status } : item
        ),
      [],
      `update inquiry ${id} status to ${status}`
    );

    const updatedItem = updatedList.find((i) => i.id === id);
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Failed to update inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await updateJson<Inquiry[]>(
      'inquiries.json',
      (current) => (current || []).filter((item) => item.id !== id),
      [],
      `delete inquiry ${id}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
