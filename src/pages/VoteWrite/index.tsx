import { Button, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Container } from '../../components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import db from '../../database/firebase';
import { RootState } from '../../modules';
import { useSelector } from 'react-redux';

const VoteWrite: React.FC = () => {
    const history = useHistory();
    const userId = useSelector((state: RootState) => state.main.id);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const now = new Date();
    const tomorrow = new Date();
    now.setTime(now.getTime()+3600000*9); // 현재한국현지시간
    tomorrow.setTime(now.getTime()+3600000*24); // 내일한국현지시간
    const [startDateTime, setStartDateTime] = useState(now.toISOString().substr(0, 19));
    const [finishDateTime, setFinishDateTime] = useState(tomorrow.toISOString().substr(0, 19));
    const [options, setOptions] = useState(["","",""]);
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
    const handleClickAddOption = () => {
        setOptions(options => options.concat([""]));
    };
    const handleClickRemoveOption = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const index = Number(e.currentTarget.name);
        setOptions(options => {
            const newOptions = [...options]
            newOptions.splice(index,1)
            return newOptions;
        })
    };
    const handleClickCancel = () => {
        if(window.confirm("정말 취소하시겠습니까?")){
            history.push("/");
        }
    };
    const handleClickSave = () => {
        if(validation()){
            const newVotingRef = db.collection("voting").doc();
            const id = newVotingRef.id;
            newVotingRef.set({
                id: id,
                writer: userId,
                title: title,
                content: content,
                startDateTime: startDateTime,
                finishDateTime: finishDateTime,
                options: options,
                date: new Date(),
                result: {},
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
    return (
        <Container>
            <Grid container direction={"column"} justify={"flex-start"} alignItems={"stretch"}>
                <Grid item style={{padding:"30px 0px"}}>
                    <Typography variant={"h4"}>
                        투표 등록
                    </Typography>
                </Grid>
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
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        edge="end"
                                                        name={`${index}`}
                                                        onClick={handleClickRemoveOption}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            value={option}
                                            name={`${index}`}
                                            onChange={handleChangeOption}
                                            />
                                        </Grid>
                                    )
                                })
                            }
                            <Grid item>
                                <Button onClick={handleClickAddOption} fullWidth variant={"outlined"}>
                                    추가하기
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item container direction="row" justify="flex-end" style={{padding:"30px 0px", gap:8}}>
                    <Button onClick={handleClickCancel} variant={"outlined"}>취소</Button>
                    <Button onClick={handleClickSave} variant={"outlined"}>저장</Button>
                </Grid>
            </Grid>
        </Container>
    )
}

export default VoteWrite;