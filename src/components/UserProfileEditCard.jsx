import React, { useState, useEffect } from 'react';

import { useOutletContext } from 'react-router-dom';

import Card from '@mui/joy/Card';
import AspectRatio from '@mui/joy/AspectRatio';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import { styled } from '@mui/joy';

import UserProfileEditStatusCard from './UserProfileEditStatusCard';
import { fetchUser, updateUser } from '../utils/UserManager';

const USER_BACKEND_URL = import.meta.env.VITE_DATABASE_BACKEND_URL;

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

export default function UserProfileEditCard(props) {
    const userProfileEditType = props.userProfileEditType;

    const [isAuthenticated, setIsAuthenticated, userInfo, setUserInfo] = useOutletContext();

    const [userProfileSubmissionStatus, setUserProfileSubmissionStatus] = useState('no submission');

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [affiliation, setAffiliation] = useState();
    const [bio, setBio] = useState();

    const [profilePictureFile, setProfilePictureFile] = useState();
    const [profilePictureFileURL, setProfilePictureFileURL] = useState();

    useEffect(() => {
        const fetchUserInfoFromDB = async () => {
            console.log('fetching user info from DB...')
            const userFromDB = await fetchUser(userInfo.sub);
            console.log('user info from db', userFromDB)

            setFirstName(userFromDB['first_name']);
            setLastName(userFromDB['last_name']);
            setEmail(userFromDB['email']);
            setAffiliation(userFromDB['affiliation']);
            setBio(userFromDB['bio']);
            setProfilePictureFileURL(userFromDB['avatar_url']);
        }
        if (userInfo.sub) {
            fetchUserInfoFromDB();
        }
    }, [userInfo]);

    const handleProfilePictureUpload = (event) => {
        const profilePicture = event.target.files[0];
        if (!profilePicture.type.startsWith('image/')) {
            alert('We only accept an image here!');
            setProfilePictureFile(null);
            setProfilePictureFileURL(null);
            return null;
        }
        setProfilePictureFile(profilePicture);
        setProfilePictureFileURL(URL.createObjectURL(profilePicture));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {};
        let avatar_url = '';

        // If user uploads a new profile picture, use the new one, otherwise, use the existing one.
        if (profilePictureFile) {
            const formData = new FormData();
            formData.append('file', profilePictureFile);

            const response = await fetch(`${USER_BACKEND_URL}/api/upload-avatar`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            avatar_url = result.url;
        } else {
            avatar_url = profilePictureFileURL;
        }
        
        const result = await updateUser(userInfo.sub, firstName, lastName, email, affiliation, bio, avatar_url);

        if (userProfileEditType === 'update') {
            if (result && result.message === 'User updated successfully') {
                setUserProfileSubmissionStatus('update-succeeded');
            } else {
                setUserProfileSubmissionStatus('update-failed');
            }
        } else {
            if (result && result.message === 'User updated successfully') {
                setUserProfileSubmissionStatus('update-succeeded');
            } else {
                setUserProfileSubmissionStatus('update-failed');
            }
        }
    }

    // After submission, show users the submission status. 
    if (userProfileSubmissionStatus !== 'no submission') {
        return (
            <UserProfileEditStatusCard userProfileSubmissionStatus={userProfileSubmissionStatus} />
        )
    }

    return (
        <Card
            variant="outlined"
            sx={{
                maxHeight: 'max-content',
                maxWidth: '900px',
                width: '100%'
            }}
        >
            <Typography level="title-lg" >
                Update your user profile
            </Typography>
            <Divider inset="none" />
            <form onSubmit={handleSubmit} name="resourceForm">
                <CardContent
                    sx={{
                        display: 'grid',
                        // gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
                        gap: 1.5,
                    }}
                >
                    {firstName ?
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>First name</FormLabel>
                            <Input name="first_name" disabled value={firstName} />
                        </FormControl>
                        :
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>First name (required)</FormLabel>
                            <Input name="first_name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        </FormControl>
                    }
                    {lastName ?
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Last name</FormLabel>
                            <Input name="last_name" disabled value={lastName} />
                        </FormControl>
                        :
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Last name (required)</FormLabel>
                            <Input name="last_name" required value={lastName} onChange={(event) => setFirstName(event.target.value)} />
                        </FormControl>
                    }
                    {email ?
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>E-mail</FormLabel>
                            <Input name="email" disabled value={email} />
                        </FormControl>
                        :
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>E-mail (required)</FormLabel>
                            <Input name="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                        </FormControl>
                    }
                    {affiliation ?
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Affiliation</FormLabel>
                            <Input name="affiliation" disabled value={affiliation} />
                        </FormControl>
                        :
                        <FormControl sx={{ gridColumn: '1/-1' }}>
                            <FormLabel>Affiliation (required)</FormLabel>
                            <Input name="affiliation" required value={affiliation} onChange={(event) => setAffiliation(event.target.value)} />
                        </FormControl>
                    }

                    <FormControl sx={{ gridColumn: '1/-1' }}>
                        <FormLabel>Upload your profile picture</FormLabel>
                        <Button
                            component="label"
                            role={undefined}
                            tabIndex={-1}
                            variant="outlined"
                            color="primary"
                            name="avatar_url"
                        >
                            Upload your profile picture
                            <VisuallyHiddenInput type="file" onChange={handleProfilePictureUpload} />
                        </Button>
                        {profilePictureFileURL &&
                            <div>
                                <Typography>Profile picture preview</Typography>
                                <AspectRatio ratio="1" sx={{ width: 190 }}>
                                    <img
                                        src={profilePictureFileURL}
                                        loading="lazy"
                                        alt="Profile picture preview"
                                    />
                                </AspectRatio>
                            </div>
                        }
                    </FormControl>
                    <FormControl sx={{ gridColumn: '1/-1' }}>
                        <FormLabel>Bio</FormLabel>
                        <Textarea
                            name="contents"
                            minRows={4}
                            maxRows={10}
                            value={bio}
                            onChange={(event) => setBio(event.target.value)}
                        />
                    </FormControl>

                    <CardActions sx={{ gridColumn: '1/-1' }}>
                        <Button type="submit" variant="solid" color="primary">
                            Update your profile
                        </Button>
                    </CardActions>
                </CardContent>
            </form>
        </Card>
    )
}