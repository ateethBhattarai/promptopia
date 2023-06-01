'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
    const router = useRouter();

    const { data: session } = useSession();
    const [post, setPost] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json();

            setPost(data);
        }

        if (session?.user.id) fetchPosts();
    }, [])

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`)
    }

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete?");

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`,
                    { method: 'DELETE' });

                const filteredPosts = post.filter((post) => post._id !== post._id);
                setPost(filteredPosts);

            } catch (error) {
                console.log(error);
            } finally {
                router.push('/');
            }
        }
    }

    return (
        <Profile
            name="My"
            desc="Welcome to your profile page."
            data={post}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default MyProfile