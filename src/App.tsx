import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Avatar, Box, List } from '@mui/material';
import './App.css';

interface User {
    id: number | string;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    avatar: string;
    isChecked?: boolean;
}

const fetchUsers = async (): Promise<User[]> => {
    const response = await axios.get(
        'https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json'
    );
    return response.data;
};

const App = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers().then((users) =>
            setUsers(
                users
                    .map((user) => ({ ...user, isChecked: false }))
                    .sort((a: User, b: User) => {
                        if (a.last_name > b.last_name) {
                            return 1;
                        }
                        if (a.last_name < b.last_name) {
                            return -1;
                        }
                        return 0;
                    })
            )
        );
    }, []);

    const getFullUserName = (user: User): string =>
        `${user.first_name} ${user.last_name}`;

    const renderUsers = () =>
        users.map((user, index) => (
            <div key={index}>
                <Avatar alt={getFullUserName(user)} src={user.avatar} />
                <p>{getFullUserName(user)}</p>
            </div>
        ));

    return (
        <Box>
            <List>{renderUsers()}</List>
        </Box>
    );
};

export default App;
