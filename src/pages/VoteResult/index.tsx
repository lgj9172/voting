import { Box, Button, Divider, Grid, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Container, Tag } from '../../components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import db from '../../database/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../modules';
import CheckIcon from '@material-ui/icons/Check';

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
    const [nowDateTime, setNowDateTime] = useState(now.toISOString().substr(0, 19));
    const [startDateTime, setStartDateTime] = useState(now.toISOString().substr(0, 19));
    const [finishDateTime, setFinishDateTime] = useState(tomorrow.toISOString().substr(0, 19));
    const [options, setOptions] = useState(["","",""]);
    const [status, setStatus] = useState("before");
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [result, setResult] = useState<any>({});
    const [maxCountOptions, setMaxCountOptions] = useState<string[]>([]);
    const handleClickConfirm = () => {
        history.push("/");
    };
    useEffect(()=>{
        db.collection("voting").doc(docId).get().then((doc) => {
            const data = doc.data();
            if(data===undefined){
                setStatus("nodata");
            }else{
                setTitle(data.title);
                setContent(data.content);
                setStartDateTime(data.startDateTime);
                setFinishDateTime(data.finishDateTime);
                setOptions(data.options);
                setSelectedIndex(data.result[userId]===undefined?-1:data.result[userId]);
                setResult(data.result);
                // 최빈값 구하기
                const voteTotalCount = Object.keys(data.result).length;
                const voteIndexCounter = new Map();
                const voteIndexs = Object.values(data.result);
                voteIndexs.forEach((voteValue)=>{
                    if(voteIndexCounter.has(voteValue)){
                        voteIndexCounter.set(voteValue, voteIndexCounter.get(voteValue)+1)
                    }else{
                        voteIndexCounter.set(voteValue, 1)
                    }
                })
                const maxCount = Math.max(...Array.from(voteIndexCounter.values()))
                const maxCountOptions = new Array();
                voteIndexCounter.forEach((value, key) => {
                    if(value===maxCount){
                        maxCountOptions.push(data.options[key]);
                    }
                })
                setMaxCountOptions(maxCountOptions);
                setStatus("done");
            }
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
                    :status==="nodata"
                    ?<Grid item>
                        데이터베이스에서 찾을 수 없는 투표입니다.
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
                                <Typography variant={"body2"}>
                                    {content}
                                </Typography>
                            </Grid>
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        시작일시
                                    </InputLabel>
                                    <Typography variant={"body2"}>
                                        {startDateTime.replace("T"," ")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        종료일시
                                    </InputLabel>
                                    <Typography variant={"body2"}>
                                        {finishDateTime.replace("T"," ")}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        진행중여부
                                    </InputLabel>
                                    <Typography component="div" variant={"body2"}>
                                        {
                                            finishDateTime > nowDateTime && startDateTime < nowDateTime
                                            ?<React.Fragment>
                                                <Tag bgcolor="success.main">진행중</Tag>&nbsp;{maxCountOptions.join(", ")}
                                            </React.Fragment>
                                            :finishDateTime < nowDateTime
                                            ?<React.Fragment>
                                                <Tag bgcolor="text.disabled">종료됨</Tag>&nbsp;{maxCountOptions.join(", ")}
                                            </React.Fragment>
                                            :startDateTime > nowDateTime
                                            ?<Tag bgcolor="info.main">진행예정</Tag>
                                            :""
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        참여여부
                                    </InputLabel>
                                    <Typography component="div" variant={"body2"}>
                                        {
                                            selectedIndex > -1
                                            ?<Tag bgcolor="info.main">참여함</Tag>
                                            :<Tag bgcolor="error.main">참여하지않음</Tag>
                                        }
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
                                            const props = Number((count / (total||1) * 100).toFixed(2)) // count가 0인 경우 대비
                                            return (
                                                <Grid item container direction="column" justify="flex-start" alignItems="stretch" key={option} style={{padding:"10px 0px", gap:"8px"}}>
                                                    <Grid item>
                                                        <Typography component="div" variant={"body2"}>
                                                            {`${option} (${count}/${total}, ${props}%)`}
                                                            &nbsp;{selectedIndex===index?<Tag bgcolor="primary.main"><CheckIcon fontSize="small"/>여기 투표했어요</Tag>:null}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <LinearProgress variant="determinate" value={props}  color="primary"/>
                                                    </Grid>
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