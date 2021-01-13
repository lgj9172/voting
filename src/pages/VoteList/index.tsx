import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../modules/main';
import { RootState } from '../../modules';
import { Container } from '../../components/common';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import db from '../../database/firebase';

const VoteList: React.FC = () => {
    const userId = useSelector((state: RootState) => state.main.id)
    const history = useHistory();
    const dispatch = useDispatch();
    const [votings, setVotings] = useState([]);
    const [status, setStatus] = useState("before");
    const handleClickUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(login(e.currentTarget.value))
    }
    const handleClickWrite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        history.push('/write');
    }
    const handleClickDetail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const id = e.currentTarget.name;
        history.push(`/detail/${id}`);
    }
    const handleClickUpdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const id = e.currentTarget.name;
        history.push(`/update/${id}`);
    }
    useEffect(()=>{
        db.collection("voting").get().then((querySnapshot) => {
            const newVotings:any = [];
            querySnapshot.forEach((doc) => {
                newVotings.push(doc.data())
            })
            setVotings(newVotings);
            setStatus("done");
        }).catch((error)=>{
            setStatus("error");
        })
    },[])
    return (
        <Container>
            {/* 로그인 */}
            <div style={{
                padding: 10,
                background: '#888888'
            }}>
                <Typography component="div">
                    <Box fontWeight={900}>
                        사용자변경하기(현재사용자:{userId})
                    </Box>
                </Typography>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <Button onClick={handleClickUser} value={"admin"} variant={"contained"} size={"small"}>admin</Button>
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
            {/* 목록 생성 */}
            <Grid container direction="column" justify="flex-start" alignItems="stretch" style={{gap:"8px"}}>
            {
                status==="before"
                ?<Grid item>
                    데이터를 가져오는 중입니다.
                </Grid>
                :status==="done"
                ?<React.Fragment>
                    {
                        votings.map((voting:any)=>
                            <Grid item container direction="column" justify="flex-start" alignItems="stretch" key={voting.title} style={{border:"solid 1px gray", padding:"10px", gap:"8px"}}>
                                <Grid item>
                                    <Typography variant={"h5"}>{voting.title}</Typography>
                                </Grid>
                                <Grid item>
                                    {voting.startDateTime.replace("T"," ")} ~ {voting.finishDateTime.replace("T"," ")}
                                </Grid>
                                <Grid item container style={{gap:8}}>
                                    <Button onClick={handleClickDetail} name={voting.id} variant="outlined">자세히보기</Button>
                                    {
                                        userId==="admin"
                                        ?<Button onClick={handleClickUpdate} name={voting.id} variant="outlined">수정하기</Button>
                                        :null
                                    }
                                </Grid>
                            </Grid>
                        )
                    }
                </React.Fragment>
                :status==="error"
                ?<React.Fragment>
                    에러가 발생했습니다.
                </React.Fragment>
                :null
            }
            </Grid>
        </Container>
    )
};

export default VoteList;