import { Button, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Container } from '../../components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import db from '../../database/firebase';

const VoteUpdate: React.FC = () => {
    const history = useHistory();
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
    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(e.currentTarget.value)
    };
    const handleChangeContent = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value)
    };
    const handleChangeStartDateTime = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const startDateTime = e.currentTarget.value;
        if(finishDateTime<startDateTime){
            alert("종료시간보다 이후시간을 선택하실 수 없습니다.")
        }else{
            setStartDateTime(startDateTime)
        }
    };
    const handleChangeFinishDateTime = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const finishDateTime = e.currentTarget.value;
        if(finishDateTime<startDateTime){
            alert("시작시간보다 이전시간을 선택하실 수 없습니다.")
        }else{
            setFinishDateTime(e.currentTarget.value)
        }
    };
    const handleChangeOption = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const index = Number(e.currentTarget.name);
        const value = e.currentTarget.value;
        setOptions(options => {
            const newOptions = [...options]
            newOptions[index] = value;
            return newOptions;
        });
    };
    const handleClickCancel = () => {
        if(window.confirm("정말 취소하시겠습니까?")){
            history.push("/");
        }
    };
    const handleClickSave = () => {
        if(validation()){
            db.collection("voting").doc(docId).update({
                id: docId,
                title: title,
                content: content,
                startDateTime: startDateTime,
                finishDateTime: finishDateTime,
                options: options,
                date: new Date(),
            }).then(function(docRef){
                alert("성공적으로 저장되었습니다.");
                history.push("/");
            }).catch(function(error){
                alert("저장중에 에러가 발생하였습니다.");
            })
        }
    };
    const validation = () => {
        if(title===""){
            alert("제목이 입력되지 않았습니다.");
            return false;
        }else if(startDateTime===""){
            alert("시작일시가 입력되지 않았습니다.");
            return false;
        }else if(finishDateTime===""){
            alert("종료일시가 입력되지 않았습니다.");
            return false;
        }else if(options.filter(value=>value==="").length>0){
            alert("입력되지 않은 옵션이 있습니다.")
        }else if(new Set(options).size !== options.length){
            alert("내용이 중복된 옵션이 있습니다.")
        }
        return true;
    };
    useEffect(()=>{
        db.collection("voting").doc(docId).get().then((doc) => {
            const data = doc.data();
            setTitle(data?.title);
            setContent(data?.content);
            setStartDateTime(data?.startDateTime);
            setFinishDateTime(data?.finishDateTime);
            setOptions(data?.options);
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
                        투표 수정
                    </Typography>
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
                                <TextField value={title} onChange={handleChangeTitle} fullWidth variant={"outlined"}/>
                            </Grid>
                            <Grid item>
                                <InputLabel shrink>
                                    내용
                                </InputLabel>
                                <TextField value={content} onChange={handleChangeContent} fullWidth variant={"outlined"} multiline rows={5} rowsMax={5}/>
                            </Grid>
                            <Grid item container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        시작일시
                                    </InputLabel>
                                    <TextField
                                        type="datetime-local"
                                        variant="outlined"
                                        fullWidth
                                        value={startDateTime}
                                        onChange={handleChangeStartDateTime}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputLabel shrink>
                                        종료일시
                                    </InputLabel>
                                    <TextField
                                        type="datetime-local"
                                        variant="outlined"
                                        fullWidth
                                        value={finishDateTime}
                                        onChange={handleChangeFinishDateTime}
                                        InputLabelProps={{
                                        shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <InputLabel shrink>
                                    옵션
                                </InputLabel>
                                <Grid container direction={"column"} justify={"flex-start"} alignItems={"stretch"} style={{gap:8}}>
                                    {
                                        options.map((option:string, index:number)=>{
                                            return (
                                                <Grid item key={index}>
                                                    <OutlinedInput
                                                    fullWidth
                                                    value={option}
                                                    name={`${index}`}
                                                    onChange={handleChangeOption}
                                                    />
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container direction="row" justify="flex-end" style={{padding:"30px 0px", gap:8}}>
                            <Button onClick={handleClickCancel} variant={"outlined"}>취소</Button>
                            <Button onClick={handleClickSave} variant={"outlined"}>저장</Button>
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

export default VoteUpdate;