import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../modules/main';
import { RootState } from '../../modules';
import { Container } from '../../components/common';
import { useHistory } from 'react-router-dom';
import { Box, Button, Typography } from '@material-ui/core';

const VoteList: React.FC = () => {
    const userId = useSelector((state: RootState) => state.main.id)
    const history = useHistory();
    const dispatch = useDispatch();
    const handleClickUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(login(e.currentTarget.value))
    }
    const handleClickWrite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        history.push('/write');
    }
    return (
        <Container>
            {/* 로그인 */}
            <div style={{
                padding: 10,
                background: '#888888'
            }}>
                <Typography>
                    <Box fontWeight={900}>
                        사용자변경(현재사용자:{userId})
                    </Box>
                </Typography>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <Button onClick={handleClickUser} value={"admin"} variant={"contained"} size={"small"}>생성자</Button>
                    <Button onClick={handleClickUser} value={"user1"} variant={"contained"} size={"small"}>user1</Button>
                    <Button onClick={handleClickUser} value={"user2"} variant={"contained"} size={"small"}>user2</Button>
                    <Button onClick={handleClickUser} value={"user3"} variant={"contained"} size={"small"}>user3</Button>
                    <Button onClick={handleClickUser} value={"user4"} variant={"contained"} size={"small"}>user4</Button>
                    <Button onClick={handleClickUser} value={"user5"} variant={"contained"} size={"small"}>user5</Button>
                    <Button onClick={handleClickUser} value={"user6"} variant={"contained"} size={"small"}>user6</Button>
                </div>
            </div>
            {/* 투표 생성 */}
            <div style={{
                margin: 10,
                display: 'flex',
                justifyContent: 'flex-end',
            }}>
                <Button onClick={handleClickWrite} disabled={userId!=="admin"} variant={"outlined"}>투표생성</Button>
            </div>
        </Container>
    )
};

export default VoteList;