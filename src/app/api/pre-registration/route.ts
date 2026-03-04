import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

async function grantDiscordRole(discordUserId: string) {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;
    const roleId = process.env.DISCORD_PRE_REG_ROLE_ID;

    if (!botToken || !guildId || !roleId) {
        return { ok: false, reason: 'missing_env' as const };
    }

    const endpoint = `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`;
    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Length': '0',
        },
    });

    if (response.ok) {
        return { ok: true as const };
    }

    const body = await response.text();
    return {
        ok: false as const,
        reason: 'discord_api_error' as const,
        status: response.status,
        body,
    };
}

export async function GET() {
    try {
        const session = await auth();
        const [countResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM realworld.minchan_save');
        const totalCount = countResult[0].count;

        let isRegistered = false;
        if (session?.user?.id) {
            const [userResult] = await pool.query<RowDataPacket[]>(
                'SELECT 1 FROM realworld.minchan_save WHERE discord_id = ?',
                [session.user.id]
            );
            isRegistered = userResult.length > 0;
        }

        return NextResponse.json({ count: totalCount, isRegistered });
    } catch (error) {
        console.error('Failed to fetch pre-registration data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const discordId = session.user.id;
        console.log('[API] Pre-registering. Session User ID:', discordId, 'Type:', typeof discordId);

        // Check if already registered
        const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT 1 FROM realworld.minchan_save WHERE discord_id = ?',
            [discordId]
        );

        if (existing.length > 0) {
            return NextResponse.json({ message: 'Already registered' }, { status: 400 });
        }

        // Register user
        await pool.query('INSERT INTO realworld.minchan_save (discord_id) VALUES (?)', [discordId]);

        const roleResult = await grantDiscordRole(discordId);
        if (!roleResult.ok) {
            console.warn('[API] Failed to grant Discord pre-registration role:', {
                discordId,
                ...roleResult,
            });
        }

        // Get updated count
        const [countResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM realworld.minchan_save');
        const totalCount = countResult[0].count;

        return NextResponse.json({
            success: true,
            count: totalCount,
            roleAssigned: roleResult.ok,
        });
    } catch (error) {
        console.error('Failed to pre-register:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
