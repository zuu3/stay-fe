'use server';

import pool from './db';
import type { Block } from "@blocknote/core";

export type Post = {
    id: string;
    tag: "공지" | "패치" | "이벤트";
    date: string;
    title: string;
    summary: string;
    content: Block[];
};

// 초기 테이블 생성 (필요 시)
async function ensureTable() {
    const conn = await pool.getConnection();
    try {
        await conn.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id VARCHAR(255) PRIMARY KEY,
                tag ENUM('공지', '패치', '이벤트') NOT NULL,
                date VARCHAR(20) NOT NULL,
                title VARCHAR(255) NOT NULL,
                summary TEXT,
                content LONGTEXT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } finally {
        conn.release();
    }
}

export async function getPosts(): Promise<Post[]> {
    await ensureTable();
    const [rows] = await pool.query('SELECT * FROM posts ORDER BY createdAt DESC');
    const posts = rows as any[];
    return posts.map(row => ({
        ...row,
        content: JSON.parse(row.content)
    }));
}

export async function getPost(id: string): Promise<Post | undefined> {
    await ensureTable();
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    const posts = rows as any[];
    if (posts.length === 0) return undefined;

    return {
        ...posts[0],
        content: JSON.parse(posts[0].content)
    };
}

export async function createPost(post: Omit<Post, "id" | "date">): Promise<Post> {
    await ensureTable();
    const id = Date.now().toString();
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

    const newPost: Post = {
        ...post,
        id,
        date: dateStr,
    };

    await pool.query(
        'INSERT INTO posts (id, tag, date, title, summary, content) VALUES (?, ?, ?, ?, ?, ?)',
        [newPost.id, newPost.tag, newPost.date, newPost.title, newPost.summary, JSON.stringify(newPost.content)]
    );

    return newPost;
}

export async function updatePost(id: string, data: Partial<Omit<Post, "id">>): Promise<Post | undefined> {
    await ensureTable();
    const existing = await getPost(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: any[] = [];

    if (data.tag) { fields.push('tag = ?'); values.push(data.tag); }
    if (data.title) { fields.push('title = ?'); values.push(data.title); }
    if (data.summary) { fields.push('summary = ?'); values.push(data.summary); }
    if (data.content) { fields.push('content = ?'); values.push(JSON.stringify(data.content)); }

    if (fields.length === 0) return existing;

    values.push(id);
    await pool.query(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`, values);

    return await getPost(id);
}

export async function deletePost(id: string): Promise<boolean> {
    await ensureTable();
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
}

export async function isAdmin(email?: string | null): Promise<boolean> {
    if (!email) return false;
    const adminEmailsStr = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsStr.split(",").map(e => e.trim());
    return adminEmails.includes(email);
}
