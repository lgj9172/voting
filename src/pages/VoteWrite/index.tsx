import { Button, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Container } from '../../components/common';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';

const VoteWrite: React.FC = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [options, setOptions] = useState(["","",""]);
    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(e.currentTarget.value)
    };
    const handleChangeContent = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value)
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