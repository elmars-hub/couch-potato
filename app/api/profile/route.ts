import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user from Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...(name !== undefined && { name }),
      },
    });

    // Update Supabase auth metadata if needed
    if (name !== undefined) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...(name !== undefined && { name }),
        },
      });

      if (updateError) {
        console.error('Error updating Supabase user metadata:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
