import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const uid = req.headers.get('x-user-id')
        const commentId = params.id

        if (!uid) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { content } = await req.json()

        if (!content) {
            return NextResponse.json(
                { success: false, message: 'Content is required' },
                { status: 400 }
            )
        }

        const { data: existingComment, error: fetchError } =
            await adminSupabase
                .from('comments')
                .select('id, user_uid')
                .eq('id', commentId)
                .single()

        if (fetchError || !existingComment) {
            return NextResponse.json(
                { success: false, message: 'Comment not found' },
                { status: 404 }
            )
        }

        if (existingComment.user_uid !== uid) {
            return NextResponse.json(
                { success: false, message: 'Forbidden' },
                { status: 403 }
            )
        }

        const { data, error } = await adminSupabase
            .from('comments')
            .update({
                content,
                updated_at: new Date().toISOString()
            })
            .eq('id', commentId)
            .select(`
        *,
        user:users (
          uid,
          displayName,
          photoURL
        )
      `)
            .single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            data
        })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const uid = req.headers.get('x-user-id')
        const commentId = params.id

        if (!uid) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { data: existingComment, error: fetchError } =
            await adminSupabase
                .from('comments')
                .select('id, user_uid')
                .eq('id', commentId)
                .single()

        if (fetchError || !existingComment) {
            return NextResponse.json(
                { success: false, message: 'Comment not found' },
                { status: 404 }
            )
        }

        if (existingComment.user_uid !== uid) {
            return NextResponse.json(
                { success: false, message: 'Forbidden' },
                { status: 403 }
            )
        }

        const { error } = await adminSupabase
            .from('comments')
            .delete()
            .eq('id', commentId)

        if (error) throw error

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully'
        })

    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        )
    }
}
