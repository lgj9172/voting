import { Box } from "@material-ui/core";
import styled from "styled-components";

export const Container = styled.div`
    box-sizing: border-box;
    max-width: 600px;
    min-height: 100vh;
    margin: 0px auto;
    padding: 10px;
`;

export const Tag = styled(Box)`
    display: inline-flex;
    border-radius: 5px;
    padding: 2px 7px;
    color: #FFFFFF;
`;