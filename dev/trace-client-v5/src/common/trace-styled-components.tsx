import styled from 'styled-components'

const StyledContainer = styled.div`
    display:grid;
    height: minmax(100vh,auto);
    /* height: 100vh; */
    vertical-align:middle;
    /* grid-template-columns: minmax(0,15%) auto; */
    grid-template-columns: 260px auto;
    grid-template-rows: 55px 28px 1fr 28px;
    grid-template-areas: 'left header'
    'left subHeader'
    'left main'
    'left footer';
`

const StyledMobileContainer = styled.div`
    display:grid;
    height: auto;
    grid-template-columns: auto;
    grid-template-rows: 55px 1fr;
    grid-template-areas: 'header'
    'main'
`

const StyledHeader = styled.div`
    grid-area:header;
    background-color: darkmagenta;
    color:white;
    display:flex;
    /* align-items: baseline; */
    align-items: center;
`

const StyledMainHeading = styled.span`
    display:block;
    font-size: 1.1rem;
    font-weight: bold;
    text-decoration: underline;
    /* color:darkgray; */
    margin:1rem 0.5rem;
`

const StyledLogoName = styled.i`
    color: #DDDDDD;
    font-size: 2rem;
    margin-bottom:0;
    font-weight: bold;
    margin-left: 1.5rem;
`

const StyledSubHeader = styled.div`
    grid-area:subHeader;
    background-color: lightgreen;
`

const StyledLeft = styled.div`
    grid-area:left;
    background-color: #535454;
    color: #fff;
`

const StyledFooter = styled.div`
    grid-area: footer;
    background-color: lightpink;
    color: red;
`

const StyledLinkButton = styled.button`
  font-size: 0.9rem;
  background: none;
  outline-color: #FFFFCC;
  border: none;
  margin-right: 0.5rem;
  color: white;
  cursor: pointer;
  height: 45px;
  padding-left: 1rem;
  padding-right: 1rem;
  /* making the border transparent prevents shifiting during hover */
  border: 1px solid transparent; 
  :hover{
    border: 1px solid #FFFFCC;
  }
`

const StyledLoginLinkButton = styled(StyledLinkButton)`
    color: blue;
    font-size: 0.75rem;
    float:right;
    text-decoration:underline;
    :hover{
        color: red;
    }
`

const StyledMenuLinkButton = styled.button`
    color: blue;
    text-decoration:none;
    font-size: 0.9rem;
    display:block;
    margin:0.5rem;
    float: left;
    width:auto;
    height: auto;
    outline:none;
    cursor: pointer;
    background: none;
    border:none;
`

const StyledMain = styled.div`
    grid-area:main;
    background-color:white;
    color:black;    
`

export {
    StyledContainer, StyledSubHeader, StyledHeader
    , StyledLeft, StyledMain, StyledFooter
    , StyledLinkButton
    , StyledLoginLinkButton
    , StyledMenuLinkButton
    , StyledLogoName
    , StyledMainHeading
};

/*

*/