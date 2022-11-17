import {
    Avatar,
    Card,
    Checkbox,
    Divider,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    gender: string;
    avatar: string;
}

const fetchUsers = async (): Promise<User[]> => {
    const response = await axios.get(
        'https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json'
    );
    return response.data;
};

const App = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        fetchUsers().then((users) => {
            const sortedUsers = users.sort((a: User, b: User) => {
                if (a.last_name > b.last_name) {
                    return 1;
                }
                if (a.last_name < b.last_name) {
                    return -1;
                }
                return 0;
            });
            setUsers(sortedUsers);
            setAllUsers(sortedUsers);
        });
    }, []);

    useEffect(() => {
        if (filterText.length >= 3) {
            const filteredUsers = allUsers.filter((user) =>
                getFullName(user)
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
            );
            setUsers(filteredUsers);
        } else {
            setUsers(allUsers);
        }
    }, [filterText, users, allUsers]);

    useEffect(() => {
        if (checkedList.length > 0) {
            console.log(checkedList);
        }
    }, [checkedList]);

    const isItemChecked = (userId: number) =>
        checkedList.some((id) => id === userId);

    const handleListItemClick = (userId: number) => {
        if (isItemChecked(userId)) {
            setCheckedList(checkedList.filter((id) => id !== userId));
        } else {
            setCheckedList([...checkedList, userId]);
        }
    };

    const getFullName = (user: User): string =>
        `${user.first_name} ${user.last_name}`;

    const renderUsers = () =>
        users.map((user, index) => (
            <ListItemButton
                selected={isItemChecked(user.id)}
                onClick={() => handleListItemClick(user.id)}
                key={index}
            >
                <ListItemAvatar>
                    <Avatar src={user.avatar} alt={getFullName(user)} />
                </ListItemAvatar>
                <ListItemText>{getFullName(user)}</ListItemText>
                <Checkbox
                    checked={isItemChecked(user.id)}
                    onChange={() => handleListItemClick(user.id)}
                ></Checkbox>
            </ListItemButton>
        ));

    return (
        <>
            <Toolbar
                sx={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ marginLeft: 'auto', marginRight: 'auto' }}
                >
                    User List
                </Typography>
            </Toolbar>
            <Card sx={{ textAlign: 'center' }}>
                <TextField
                    sx={{ width: '99%' }}
                    variant="outlined"
                    label="Search"
                    value={filterText}
                    onChange={(event) => setFilterText(event.target.value)}
                    margin="dense"
                />
            </Card>
            <Divider />
            <Card>
                <List>{renderUsers()}</List>
            </Card>
        </>
    );
};

export default App;
