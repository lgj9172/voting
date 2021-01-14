import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../modules/main';
import { RootState } from '../../modules';
import { Container, Tag } from '../../components/common';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid, styled as muiStyled, Typography } from '@material-ui/core';
import db from '../../database/firebase';

const StyledChangeUserGrid = muiStyled(Grid)({
    background: "#00C896",
    borderRadius: "5px",
    padding: "10px",
    gap: "8px",
});

const StyledChangeUserButton = muiStyled(Button)({
    border: "solid 1px #FFFFFF",
    color: "#FFFFFF",
});

const StyledVoteGrid = muiStyled(Grid)({
    border: "solid 1px lightgray",
    borderRadius: "5px",
    padding: "10px",
    gap: "8px",
});

const StyledGapGrid = muiStyled(Grid)({
    gap: "8px",
});

const VoteList: React.FC = () => {
    const userId = useSelector((state: RootState) => state.main.id)
    const history = useHistory();
    const dispatch = useDispatch();
    const now = new Date();
    now.setTime(now.getTime()+3600000*9); // 현재한국현지시간
    const [nowDateTime, setNowDateTime] = useState(now.toISOString().substr(0, 19));
    const [votings, setVotings] = useState([]);
    const [status, setStatus] = useState("before");
    const handleClickUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(login(e.currentTarget.value))
    }
    const handleClickWrite = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        history.push('/write');
    }
    const handleClickSelect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const id = e.currentTarget.name;
        history.push(`/select/${id}`);
    }
    const handleClickResult = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const id = e.currentTarget.name;
        history.push(`/result/${id}`);
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
            {/* 사용자 변경 */}
            <StyledChangeUserGrid container direction="column" justify="flex-start" alignItems="stretch">
                <Grid item>
                    <Typography component="div">
                        <Box>
                            사용자변경(현재: {userId})
                        </Box>
                    </Typography>
                </Grid>
                <StyledGapGrid item container direction="row" justify="flex-start" alignItems="center">
                    <StyledChangeUserButton onClick={handleClickUser} value={"admin"} size={"small"}>admin</StyledChangeUserButton>
                    <StyledChangeUserButton onClick={handleClickUser} value={"user1"} size={"small"}>user1</StyledChangeUserButton>
                    <StyledChangeUserButton onClick={handleClickUser} value={"user2"} size={"small"}>user2</StyledChangeUserButton>
                    <StyledChangeUserButton onClick={handleClickUser} value={"user3"} size={"small"}>user3</StyledChangeUserButton>
                    <StyledChangeUserButton onClick={handleClickUser} value={"user4"} size={"small"}>user4</StyledChangeUserButton>
                    <StyledChangeUserButton onClick={handleClickUser} value={"user5"} size={"small"}>user5</StyledChangeUserButton>
                    <StyledChangeUserButton onClick={handleClickUser} value={"user6"} size={"small"}>user6</StyledChangeUserButton>
                </StyledGapGrid>
            </StyledChangeUserGrid>
            {/* 투표 생성 */}

            <div style={{
                margin: 10,
                display: 'flex',
                justifyContent: 'flex-end',
            }}>
                <Button onClick={handleClickWrite} disabled={userId!=="admin"} variant={"outlined"}>투표생성</Button>
            </div>
            {/* 목록 생성 */}
            <StyledGapGrid container direction="column" justify="flex-start" alignItems="stretch">
            {
                status==="before"
                ?<Grid item>
                    데이터를 가져오는 중입니다.
                </Grid>
                :status==="done"
                ?<React.Fragment>
                    {
                        votings.map((voting:any)=>
                            <StyledVoteGrid item container direction="column" justify="flex-start" alignItems="stretch" key={voting.title}>
                                <Grid item container alignItems="center">
                                    <Typography component="span" variant={"h5"}>{voting.title}</Typography>&nbsp;
                                    <Typography component="span" variant={"body2"}>
                                        {
                                            voting.finishDateTime > nowDateTime && voting.startDateTime < nowDateTime
                                            ?<Tag bgcolor="success.main">진행중</Tag>
                                            :voting.finishDateTime < nowDateTime
                                            ?<Tag bgcolor="text.disabled">종료됨</Tag>
                                            :voting.startDateTime > nowDateTime
                                            ?<Tag bgcolor="info.main">진행예정</Tag>
                                            :""
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"body2"}>{voting.startDateTime.replace("T"," ")} ~ {voting.finishDateTime.replace("T"," ")}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"body2"}>{` 생성자 : ${voting.writer}`}</Typography>
                                </Grid>
                                <StyledGapGrid item container>
                                    {
                                        userId==="admin"
                                        ?<Button onClick={handleClickUpdate} name={voting.id} variant="outlined">수정하기</Button>
                                        :null
                                    }
                                    {
                                        userId!=="admin" && voting.finishDateTime > nowDateTime && voting.startDateTime < nowDateTime
                                        ?<Button onClick={handleClickSelect} name={voting.id} variant="outlined">투표하기</Button>
                                        :null
                                    }
                                    {
                                        userId!=="admin"||userId==="admin"
                                        ?<Button onClick={handleClickResult} name={voting.id} variant="outlined">결과보기</Button>
                                        :null
                                    }
                                </StyledGapGrid>
                            </StyledVoteGrid>
                        )
                    }
                </React.Fragment>
                :status==="error"
                ?<React.Fragment>
                    에러가 발생했습니다.
                </React.Fragment>
                :null
            }
            </StyledGapGrid>
        </Container>
    )
};

export default VoteList;