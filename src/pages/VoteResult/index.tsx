import { Box, Button, Divider, Grid, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Container } from '../../components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import db from '../../database/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const VoteResult: React.FC = () => {
    const history = useHistory();
    const userId = useSelector((state: RootState) => state.main.id);
    const pathname = window.location.pathname;
    const docId = pathname.substring(pathname.lastIndexOf('/') + 1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const now = new Date();
    const tomorrow = new Date();
    now.setTime(now.getTime()+3600000*9); // 현재한국현지시간
    tomorrow.setTime(now.getTime()+3600000*24); // 내일한국현지시간
    const [startDateTime, setStartDateTime] = useState(now.toISOString().substr(0, 19));
    const [finishDateTime, setFinishDateTime] = useState(tomorrow.toISOString().substr(0, 19));
    const [options, setOptions] = useState(["","",""]);
    const [status, setStatus] = useState("before");
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [result, setResult] = useState({});
    const handleClickConfirm = () => {
        history.push("/");
    };
    useEffect(()=>{
        db.collection("voting").doc(docId).get().then((doc) => {
            const data = doc.data();
            setTitle(data?.title);
            setContent(data?.content);
            setStartDateTime(data?.startDateTime);
            setFinishDateTime(data?.finishDateTime);
            setOptions(data?.options);
            setSelectedIndex(data?.result[userId]===undefined?-1:data.result[userId]);
            setResult(data?.result);
            setStatus("done");
        }).catch((error)=>{
            setStatus("error");
        });
    },[])
    return (
        <Container>
            <Grid container direction={"column"} justify={"flex-start"} alignItems={"stretch"}>
                <Grid item style={{padding:"30px 0px"}}>
                    <Typography variant={"h4"}>
                        투표결과확인
                    </Typography>
                </Grid>
                <Grid item style={{padding:"0px 0px 10px"}}>
                    <Divider/>
                </Grid>
                {
                    status==="before"
                    ?<Grid item>
                        데이터를 불러오는 중입니다.
                    </Grid>
                    :status==="done"
                    ?<React.Fragment>
                        <Grid item container direction={"column"} justify={"flex-start"} alignItems={"stretch"} style={{gap:8}}>
                            <Grid item>
                                <InputLabel shrink>
                                    제목
                                </InputLabel>
                                <Typography variant={"h6"}>
                                    {title}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <InputLabel shrink>
                                    내용
                                </InputLabel>
                                <Typography variant={"body1"}>
                                    {content}
                                </Typography>
                            </Grid>
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        시작일시
                                    </InputLabel>
                                    <Typography variant={"body1"}>
                                        {startDateTime.replace("T"," ")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        종료일시
                                    </InputLabel>
                                    <Typography variant={"body1"}>
                                        {finishDateTime.replace("T"," ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <InputLabel shrink>
                                    옵션
                                </InputLabel>
                                <Grid container direction={"column"} justify={"flex-start"} alignItems={"stretch"} style={{gap:8}}>
                                    {
                                        options.map((option:string, index:number)=>{
                                            const count = Object.values(result).filter(e=>e===index).length;
                                            const total = Object.keys(result).length;
                                            const props = count / (total||1) * 100 // count가 0인 경우 대비
                                            return (
                                                <Grid item key={option}>
                                                    <Typography variant={"body2"}>
                                                        {`${option} (${count}/${total}, ${props}%)`}
                                                        {selectedIndex===index?<CheckCircleIcon color="primary"/>:null}
                                                    </Typography>
                                                    <LinearProgress variant="determinate" value={props}  color="primary"/>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container direction="row" justify="flex-end" style={{padding:"30px 0px", gap:8}}>
                            <Button onClick={handleClickConfirm} variant={"outlined"}>확인</Button>
                        </Grid>
                    </React.Fragment>
                    :status==="error"
                    ?<Grid item>
                        데이터를 불러오는 도중 에러가 발생했습니다.
                    </Grid>
                    :null
                }
                
            </Grid>
        </Container>
    )
}

export default VoteResult;