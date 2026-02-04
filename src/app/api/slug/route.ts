import { NextRequest, NextResponse } from "next/server";
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' }, 
        { status: 400 }
      )
    }

    const slug = slugify(name, {
      lower: true,
      strict: true
    })

    return NextResponse.json({ slug })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate slug' }, 
      { status: 500 }
    )
  }
}
