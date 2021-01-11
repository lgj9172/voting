import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { login } from '../../modules/main';
import { RootState } from '../../modules';

const Container = styled.div`
    max-width: 600px;
    height: 100vh;
    margin: 0px auto;
    border: solid 1px black;
    background: #ebebeb;
`;

const VoteList: React.FC = () => {
    const userId = useSelector((state: RootState) => state.main.id)
    const dispatch = useDispatch();
    const handleClickUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(login(e.currentTarget.value))
    }
    return (
        <Container>
            <div style={{
                padding: 10,
                background: '#888888'
            }}>
                <div style={{
                    color:'#00c896',
                    fontWeight: 900,
                }}>
                    사용자변경({userId})
                </div>
                <div style={{
                    display: 'flex',
                }}>
                    <button onClick={handleClickUser} value={"admin"}>투표생성자</button>
                    <button onClick={handleClickUser} value={"user1"}>사용자1</button>
                    <button onClick={handleClickUser} value={"user2"}>사용자2</button>
                    <button onClick={handleClickUser} value={"user3"}>사용자3</button>
                    <button onClick={handleClickUser} value={"user4"}>사용자4</button>
                    <button onClick={handleClickUser} value={"user5"}>사용자5</button>
                    <button onClick={handleClickUser} value={"user6"}>사용자6</button>
                </div>
            </div>
            <div style={{
                margin: 10,
                display: 'flex',
                justifyContent: 'flex-end',
            }}>
                <button disabled={userId!=="admin"}>투표생성</button>
            </div>
        </Container>
    )
};

export default VoteList;