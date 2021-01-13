import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { Container } from '../../components/common';

const VoteWrite: React.FC = () => {
    return (
        <Container>
            <Grid container direction={"column"} justify={"flex-start"} alignItems={"stretch"}>
                <Grid item style={{padding:"30px 0px"}}>
                    <Typography variant={"h4"}>
                        투표 등록
                    </Typography>
                </Grid>
                <Grid item container direction={"column"} justify={"flex-start"} alignItems={"stretch"} spacing={2}>
                    <Grid item>
                        <TextField label="제목" size={"small"} fullWidth variant={"outlined"}/>
                    </Grid>
                    <Grid item>
                        <TextField label="내용" size={"small"} fullWidth variant={"outlined"} multiline rows={5}/>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default VoteWrite;